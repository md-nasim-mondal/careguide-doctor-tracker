import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { envVars } from "./app/config/env";
import { User } from "./app/modules/user/user.model";
import { Role, IsActive } from "./app/modules/user/user.interface";

const BASE_URL = "http://localhost:5000/api/v1";

interface ApiResponse {
  status: number;
  data: {
    success?: boolean;
    message?: string;
    data?: unknown;
    err?: unknown;
    stack?: unknown;
  };
}

async function makeRequest(
  url: string,
  options: { method?: string; token?: string; body?: unknown } = {}
): Promise<ApiResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.token) {
    headers["Authorization"] = options.token;
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  return {
    status: response.status,
    data,
  };
}

async function runRegressionTests() {
  console.log("===============================================================");
  console.log(" Running Authentication & Authorization Regression Test Suite ");
  console.log("===============================================================");

  // Connect to DB to fetch super admin & create a test receiver user
  await mongoose.connect(envVars.DB_URL, {
    dbName: "derival81-savings-app-db",
  });

  const superAdmin = await User.findOne({ email: "admin@example.com" });
  if (!superAdmin) {
    throw new Error("Super admin user not found in database");
  }

  // Create temporary test user with insufficient role (PATIENT)
  const testReceiverEmail = `test_receiver_${Date.now()}@example.com`;
  const receiverUser = await User.create({
    name: "Receiver Test User",
    email: testReceiverEmail,
    password: "hashed_dummy_password",
    role: Role.PATIENT,
    isActive: IsActive.ACTIVE,
    isDeleted: false,
    isVerified: true,
    auths: [{ provider: "credentials", providerId: testReceiverEmail }],
  });

  try {
    // 1. Request with no token
    console.log("\n[Test 1] Request with no token -> Assert HTTP 401");
    const res1 = await makeRequest(`${BASE_URL}/doctors`);
    console.log(`Status: ${res1.status}, Message: ${res1.data.message}`);
    if (res1.status !== 401 || res1.data.success !== false) {
      throw new Error(`Test 1 Failed: Expected 401, got ${res1.status}`);
    }
    console.log("✅ Passed: No token returns HTTP 401");

    // 2. Request with malformed token
    console.log("\n[Test 2] Request with a malformed token -> Assert HTTP 401");
    const res2 = await makeRequest(`${BASE_URL}/doctors`, {
      token: "malformed.jwt.token_string",
    });
    console.log(`Status: ${res2.status}, Message: ${res2.data.message}`);
    if (res2.status !== 401 || res2.data.success !== false) {
      throw new Error(`Test 2 Failed: Expected 401, got ${res2.status}`);
    }
    console.log("✅ Passed: Malformed token returns HTTP 401");

    // Also test Bearer prefix with malformed token
    const res2b = await makeRequest(`${BASE_URL}/doctors`, {
      token: "Bearer malformed.token.value",
    });
    if (res2b.status !== 401) {
      throw new Error(`Test 2b Failed: Expected 401 with Bearer prefix, got ${res2b.status}`);
    }
    console.log("✅ Passed: Bearer prefix with malformed token returns HTTP 401");

    // 3. Request with correctly formatted but invalidly signed token
    console.log("\n[Test 3] Request with invalidly signed token -> Assert HTTP 401");
    const bogusSecretToken = jwt.sign(
      {
        userId: superAdmin._id?.toString(),
        email: superAdmin.email,
        role: superAdmin.role,
      },
      "completely_wrong_secret_1234567890",
      { expiresIn: "1h" }
    );
    const res3 = await makeRequest(`${BASE_URL}/doctors`, {
      token: bogusSecretToken,
    });
    console.log(`Status: ${res3.status}, Message: ${res3.data.message}`);
    if (res3.status !== 401 || res3.data.success !== false) {
      throw new Error(`Test 3 Failed: Expected 401, got ${res3.status}`);
    }
    console.log("✅ Passed: Invalidly signed token returns HTTP 401");

    // 4. Request with expired token
    console.log("\n[Test 4] Request with expired token -> Assert HTTP 401");
    const expiredToken = jwt.sign(
      {
        userId: superAdmin._id?.toString(),
        email: superAdmin.email,
        role: superAdmin.role,
        iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      },
      envVars.JWT_ACCESS_SECRET,
      { expiresIn: "-10s" } // expired 10 seconds ago
    );
    const res4 = await makeRequest(`${BASE_URL}/doctors`, {
      token: expiredToken,
    });
    console.log(`Status: ${res4.status}, Message: ${res4.data.message}`);
    if (res4.status !== 401 || res4.data.success !== false) {
      throw new Error(`Test 4 Failed: Expected 401, got ${res4.status}`);
    }
    console.log("✅ Passed: Expired token returns HTTP 401");

    // 5. Request with valid token and sufficient role (SUPER_ADMIN)
    console.log("\n[Test 5] Request with valid token & sufficient role -> Assert HTTP 200");
    const validAdminToken = jwt.sign(
      {
        userId: superAdmin._id?.toString(),
        email: superAdmin.email,
        role: superAdmin.role,
      },
      envVars.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );
    const res5Doctors = await makeRequest(`${BASE_URL}/doctors`, {
      token: validAdminToken,
    });
    const res5Patients = await makeRequest(`${BASE_URL}/patients`, {
      token: validAdminToken,
    });
    console.log(`GET /doctors Status: ${res5Doctors.status}, GET /patients Status: ${res5Patients.status}`);
    if (res5Doctors.status !== 200 || res5Patients.status !== 200) {
      throw new Error(`Test 5 Failed: Expected 200, got doctors=${res5Doctors.status}, patients=${res5Patients.status}`);
    }
    console.log("✅ Passed: Valid admin token successfully accesses /doctors and /patients (HTTP 200)");

    // 6. Request with valid token but insufficient role (PATIENT)
    console.log("\n[Test 6] Request with valid token & insufficient role -> Assert HTTP 403");
    const insufficientRoleToken = jwt.sign(
      {
        userId: receiverUser._id?.toString(),
        email: receiverUser.email,
        role: receiverUser.role,
      },
      envVars.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );
    const res6Doctors = await makeRequest(`${BASE_URL}/doctors`, {
      token: insufficientRoleToken,
    });
    const res6Patients = await makeRequest(`${BASE_URL}/patients`, {
      token: insufficientRoleToken,
    });
    console.log(`GET /doctors Status: ${res6Doctors.status}, Message: ${res6Doctors.data.message}`);
    console.log(`GET /patients Status: ${res6Patients.status}, Message: ${res6Patients.data.message}`);
    if (res6Doctors.status !== 403 || res6Patients.status !== 403) {
      throw new Error(`Test 6 Failed: Expected 403 Forbidden, got doctors=${res6Doctors.status}, patients=${res6Patients.status}`);
    }
    console.log("✅ Passed: Insufficient role correctly receives HTTP 403 Forbidden");

    // 7. Genuine unexpected server error
    console.log("\n[Test 7] Genuine unexpected server error -> Assert HTTP 500");
    const res7 = await makeRequest(`${BASE_URL}/test-server-error`);
    console.log(`Status: ${res7.status}, Message: ${res7.data.message}`);
    if (res7.status !== 500 || res7.data.success !== false) {
      throw new Error(`Test 7 Failed: Expected 500 Server Error, got ${res7.status}`);
    }
    console.log("✅ Passed: Genuine unexpected error returns HTTP 500");

    console.log("\n===============================================================");
    console.log(" ALL 7 AUTHENTICATION & ERROR-HANDLING TESTS PASSED!          ");
    console.log("===============================================================");
  } finally {
    // Cleanup temporary test receiver user
    await User.findByIdAndDelete(receiverUser._id);
    await mongoose.disconnect();
  }
}

runRegressionTests().catch((err) => {
  console.error("❌ Test Suite Error:", err);
  process.exit(1);
});
