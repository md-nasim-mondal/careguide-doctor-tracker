import dns from "node:dns";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { syncDoctorsAndPatientsToUsers } from "./app/utils/syncUsers";
import { seedMockData } from "./app/utils/seedMockData";

// Set Google DNS servers if supported in runtime
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch {
  // Ignored if runtime restricts custom dns settings (e.g. serverless environments)
}

let server: Server;

const startServer = async () => {
  try {
    // 1. Immediately bind and open HTTP port so Render and cloud hosts detect health checks
    const port = Number(envVars.PORT) || 5000;
    server = app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server is listening on port ${port} (0.0.0.0)`);
      console.log(`🔑 Authentication System: ${envVars.AUTH_SYSTEM.toUpperCase()}`);
    });

    // 2. Connect to MongoDB
    await mongoose.connect(envVars.DB_URL, {
      dbName: envVars.DB_NAME,
    });
    console.log("✅ Connected to Database successfully!");

    // 3. Run background seed and synchronization asynchronously without blocking port readiness
    seedSuperAdmin()
      .then(() => seedMockData())
      .then(() => syncDoctorsAndPatientsToUsers())
      .catch((err) => {
        console.error("⚠️ Background seed/sync warning:", err);
      });
  } catch (error) {
    console.error("❌ Failed to start Server or connect to Database:", error);
    process.exit(1);
  }
};

startServer();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  console.error("Unexpected error:", error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  if (server) {
    server.close(() => {
      mongoose.disconnect().finally(() => {
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  if (server) {
    server.close(() => {
      mongoose.disconnect().finally(() => {
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
});
