import dns from "node:dns";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { syncDoctorsAndPatientsToUsers } from "./app/utils/syncUsers";

// Manually set Google DNS servers
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL, {
      dbName: envVars.DB_NAME,
    });

    console.log("✅ Connected to Database successfully!");
    await seedSuperAdmin();
    await syncDoctorsAndPatientsToUsers();

    server = app.listen(envVars.PORT, () => {
      console.log(`🚀 Server is listening at http://localhost:${envVars.PORT}`);
      console.log(`🔑 Authentication System: ${envVars.AUTH_SYSTEM.toUpperCase()}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to Database:", error);
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
