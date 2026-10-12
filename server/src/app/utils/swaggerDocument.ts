export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "DocPulse Doctor Tracker API",
    version: "1.0.0",
    description:
      "Enterprise-grade RESTful API documentation for DocPulse Doctor Tracker. Includes Authentication, Users, Doctors, Patients, Assignments, Analytics, and Contact modules.",
    contact: {
      name: "DocPulse API Support",
      email: "support@careguide.local",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "/api/v1",
      description: "Current Server (v1)",
    },
    {
      url: "http://localhost:5000/api/v1",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT Bearer token (without the 'Bearer ' prefix).",
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation completed successfully" },
          data: { type: "object" },
          meta: {
            type: "object",
            properties: {
              page: { type: "number", example: 1 },
              limit: { type: "number", example: 10 },
              total: { type: "number", example: 50 },
              totalPage: { type: "number", example: 5 },
            },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Error message details" },
          errorMessages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "string", example: "email" },
                message: { type: "string", example: "Email must be valid" },
              },
            },
          },
          stack: { type: "string", nullable: true },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@careguide.local" },
          password: { type: "string", format: "password", example: "AdminPassword123!" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Dr. Gregory House" },
          email: { type: "string", format: "email", example: "house@careguide.local" },
          password: { type: "string", format: "password", example: "Password123!" },
          role: {
            type: "string",
            enum: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "PATIENT"],
            default: "PATIENT",
            example: "DOCTOR",
          },
          phone: { type: "string", example: "+1 555-0199" },
        },
      },
      ChangePasswordRequest: {
        type: "object",
        required: ["currentPassword", "newPassword"],
        properties: {
          currentPassword: { type: "string", example: "OldPassword123!" },
          newPassword: { type: "string", example: "NewPassword123!" },
        },
      },
      ForgotPasswordRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email", example: "doctor@careguide.local" },
        },
      },
      ResetPasswordRequest: {
        type: "object",
        required: ["newPassword"],
        properties: {
          newPassword: { type: "string", example: "ResetSecret123!" },
        },
      },
      Doctor: {
        type: "object",
        properties: {
          _id: { type: "string", example: "660c1f2b3e4a5d0012a3b4c5" },
          name: { type: "string", example: "Dr. Sarah Connor" },
          email: { type: "string", format: "email", example: "sarah@careguide.local" },
          phone: { type: "string", example: "+1 555-3214" },
          specialization: { type: "string", example: "Cardiology" },
          hospital: { type: "string", example: "Mayo Clinic Center" },
          user: { type: "string", description: "Reference to User ID" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      DoctorInput: {
        type: "object",
        required: ["name", "email", "phone", "specialization", "hospital"],
        properties: {
          name: { type: "string", example: "Dr. Sarah Connor" },
          email: { type: "string", format: "email", example: "sarah@careguide.local" },
          phone: { type: "string", example: "+1 555-3214" },
          specialization: { type: "string", example: "Cardiology" },
          hospital: { type: "string", example: "Mayo Clinic Center" },
        },
      },
      Patient: {
        type: "object",
        properties: {
          _id: { type: "string", example: "660c1f2b3e4a5d0012a3b4d1" },
          name: { type: "string", example: "Johnathan Doe" },
          email: { type: "string", format: "email", example: "johndoe@gmail.com" },
          phone: { type: "string", example: "+1 555-9876" },
          condition: { type: "string", example: "Hypertension" },
          age: { type: "number", example: 45 },
          gender: { type: "string", enum: ["Male", "Female", "Other"], example: "Male" },
          assignedDoctor: { $ref: "#/components/schemas/Doctor" },
          status: { type: "string", enum: ["Stable", "Recovering", "Critical", "Discharged"], example: "Stable" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PatientInput: {
        type: "object",
        required: ["name", "email", "phone", "condition", "age", "gender"],
        properties: {
          name: { type: "string", example: "Johnathan Doe" },
          email: { type: "string", format: "email", example: "johndoe@gmail.com" },
          phone: { type: "string", example: "+1 555-9876" },
          condition: { type: "string", example: "Hypertension" },
          age: { type: "number", example: 45 },
          gender: { type: "string", enum: ["Male", "Female", "Other"], example: "Male" },
          assignedDoctor: { type: "string", example: "660c1f2b3e4a5d0012a3b4c5" },
          status: { type: "string", enum: ["Stable", "Recovering", "Critical", "Discharged"], example: "Stable" },
        },
      },
      ContactInquiryInput: {
        type: "object",
        required: ["name", "email", "subject", "message"],
        properties: {
          name: { type: "string", example: "Healthcare Admin" },
          email: { type: "string", format: "email", example: "contact@hospital.org" },
          subject: { type: "string", example: "Partnership Query" },
          message: { type: "string", example: "We would like to integrate DocPulse tracker across our clinic network." },
        },
      },
    },
  },
  tags: [
    { name: "Authentication", description: "JWT login, token renewal, session termination, password management" },
    { name: "Users", description: "User directory, role assignment, verification & doctor profile approvals" },
    { name: "Doctors", description: "Doctor profiles, specialties, and doctor-patient assignment links" },
    { name: "Patients", description: "Patient registry, medical conditions, and clinical records" },
    { name: "Dashboard", description: "Operational metrics, capacity distribution, and system analytics" },
    { name: "Contact", description: "Inquiry submissions and message monitoring" },
    { name: "System", description: "Health monitoring and schema specs" },
  ],
  paths: {
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login with email & password",
        description: "Authenticates credentials, returns an access token, and sets a secure httpOnly refresh token cookie.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Login successful!" },
                    data: {
                      type: "object",
                      properties: {
                        accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                        user: {
                          type: "object",
                          properties: {
                            _id: { type: "string", example: "660c1f2b3e4a5d0012a3b4c1" },
                            name: { type: "string", example: "Admin User" },
                            email: { type: "string", example: "admin@careguide.local" },
                            role: { type: "string", example: "ADMIN" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/auth/refresh-token": {
      post: {
        tags: ["Authentication"],
        summary: "Generate new access token",
        description: "Uses the httpOnly refreshToken cookie to generate a fresh JWT access token without requiring re-login.",
        responses: {
          200: {
            description: "Token refreshed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Access token refreshed successfully" },
                    data: {
                      type: "object",
                      properties: {
                        accessToken: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Invalid or expired refresh token" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Logout user",
        description: "Clears the refresh token cookie and invalidates the active browser session.",
        responses: {
          200: {
            description: "Logged out successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Logged out successfully" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/change-password": {
      post: {
        tags: ["Authentication"],
        summary: "Change account password",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ChangePasswordRequest" },
            },
          },
        },
        responses: {
          200: { description: "Password changed successfully" },
          400: { description: "Current password mismatch or invalid input" },
        },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Authentication"],
        summary: "Request password reset link",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ForgotPasswordRequest" },
            },
          },
        },
        responses: {
          200: { description: "Reset email dispatched if account exists" },
        },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Authentication"],
        summary: "Reset account password",
        security: [{ bearerAuth: [] }],
        description: "Consumes reset password token (via Authorization header) to set a new password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ResetPasswordRequest" },
            },
          },
        },
        responses: {
          200: { description: "Password has been reset successfully" },
        },
      },
    },
    "/user/register": {
      post: {
        tags: ["Users"],
        summary: "Register new user",
        description: "Public registration for patients, doctors, or administrators.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          409: { description: "Email already registered" },
        },
      },
    },
    "/user/all-users": {
      get: {
        tags: ["Users"],
        summary: "Get all registered users (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "searchTerm", in: "query", schema: { type: "string" }, description: "Search by name or email" },
          { name: "role", in: "query", schema: { type: "string", enum: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "PATIENT"] } },
          { name: "isActive", in: "query", schema: { type: "string", enum: ["ACTIVE", "INACTIVE", "BLOCKED"] } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: {
            description: "List of users with pagination",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          _id: { type: "string" },
                          name: { type: "string" },
                          email: { type: "string" },
                          role: { type: "string" },
                          isActive: { type: "string" },
                          isVerified: { type: "boolean" },
                        },
                      },
                    },
                    meta: { $ref: "#/components/schemas/ApiResponse/properties/meta" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/user/me": {
      get: {
        tags: ["Users"],
        summary: "Get current authenticated profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Profile data of currently logged in user" },
          401: { description: "Unauthorized access" },
        },
      },
    },
    "/user/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User details retrieved" },
          404: { description: "User not found" },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update user details or role",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  phone: { type: "string" },
                  role: { type: "string", enum: ["SUPER_ADMIN", "ADMIN", "DOCTOR", "PATIENT"] },
                  isActive: { type: "string", enum: ["ACTIVE", "INACTIVE", "BLOCKED"] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "User updated successfully" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User deleted" },
        },
      },
    },
    "/user/{id}/approve-doctor": {
      patch: {
        tags: ["Users"],
        summary: "Approve doctor account (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Doctor approval granted" },
        },
      },
    },
    "/doctors": {
      get: {
        tags: ["Doctors"],
        summary: "List all doctors",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "searchTerm", in: "query", schema: { type: "string" }, description: "Search by doctor name or hospital" },
          { name: "specialization", in: "query", schema: { type: "string" } },
          { name: "date", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: {
            description: "Doctors retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        doctors: { type: "array", items: { $ref: "#/components/schemas/Doctor" } },
                        total: { type: "number", example: 12 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Doctors"],
        summary: "Create new doctor profile (Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DoctorInput" },
            },
          },
        },
        responses: {
          201: { description: "Doctor profile created" },
        },
      },
    },
    "/doctors/{id}": {
      get: {
        tags: ["Doctors"],
        summary: "Get doctor details by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Doctor record retrieved" },
          404: { description: "Doctor not found" },
        },
      },
      put: {
        tags: ["Doctors"],
        summary: "Update doctor profile (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DoctorInput" },
            },
          },
        },
        responses: {
          200: { description: "Doctor updated successfully" },
        },
      },
      delete: {
        tags: ["Doctors"],
        summary: "Delete doctor profile (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Doctor profile removed" },
        },
      },
    },
    "/doctors/{id}/patients": {
      get: {
        tags: ["Doctors"],
        summary: "Get patients assigned to a doctor",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            description: "Assigned patients list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Patient" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Doctors"],
        summary: "Assign a patient to doctor (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["patientId"],
                properties: {
                  patientId: { type: "string", example: "660c1f2b3e4a5d0012a3b4d1" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Patient assigned successfully" },
        },
      },
    },
    "/doctors/{id}/patients/{patientId}": {
      delete: {
        tags: ["Doctors"],
        summary: "Remove patient assignment from doctor",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "patientId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Patient unassigned" },
        },
      },
    },
    "/patients": {
      get: {
        tags: ["Patients"],
        summary: "List all patients",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "searchTerm", in: "query", schema: { type: "string" }, description: "Filter by patient name, phone, or condition" },
          { name: "condition", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["Stable", "Recovering", "Critical", "Discharged"] } },
          { name: "doctorId", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: {
            description: "Patients retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        patients: { type: "array", items: { $ref: "#/components/schemas/Patient" } },
                        total: { type: "number", example: 45 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Patients"],
        summary: "Create patient profile (Doctor / Admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PatientInput" },
            },
          },
        },
        responses: {
          201: { description: "Patient created successfully" },
        },
      },
    },
    "/patients/conditions": {
      get: {
        tags: ["Patients"],
        summary: "Get unique medical conditions list",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of conditions recorded in database",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { type: "string" },
                      example: ["Hypertension", "Type 2 Diabetes", "Asthma", "Cardiac Arrhythmia"],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/patients/{id}": {
      get: {
        tags: ["Patients"],
        summary: "Get patient details by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Patient record found" },
          404: { description: "Patient not found" },
        },
      },
      put: {
        tags: ["Patients"],
        summary: "Update patient record",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PatientInput" },
            },
          },
        },
        responses: {
          200: { description: "Patient record updated" },
        },
      },
      delete: {
        tags: ["Patients"],
        summary: "Delete patient record (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Patient deleted" },
        },
      },
    },
    "/dashboard/analytics": {
      get: {
        tags: ["Dashboard"],
        summary: "Get clinical and administrative metrics (Admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Analytics metrics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        totalDoctors: { type: "number", example: 18 },
                        totalPatients: { type: "number", example: 142 },
                        totalUsers: { type: "number", example: 195 },
                        unassignedPatients: { type: "number", example: 7 },
                        conditionDistribution: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              _id: { type: "string", example: "Hypertension" },
                              count: { type: "number", example: 38 },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/contact": {
      post: {
        tags: ["Contact"],
        summary: "Submit public contact inquiry",
        description: "Submit inquiry message directly to healthcare operations team.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactInquiryInput" },
            },
          },
        },
        responses: {
          201: { description: "Inquiry received successfully" },
        },
      },
      get: {
        tags: ["Contact"],
        summary: "Retrieve contact inquiries (Admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of submitted inquiries" },
        },
      },
    },
    "/health": {
      get: {
        tags: ["System"],
        summary: "System health check",
        responses: {
          200: {
            description: "API server healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "DocPulse Doctor Tracker API is healthy" },
                    uptime: { type: "number", example: 3600 },
                    timestamp: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
