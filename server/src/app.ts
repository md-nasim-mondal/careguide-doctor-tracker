import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();
app.set("trust proxy", 1);

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);

// Logging
if (envVars.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use("/api", limiter);

// Standard Body Parsers & Cookies
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Application Routes
app.use("/api/v1", router);

if (envVars.NODE_ENV !== "production") {
  app.get("/api/v1/test-server-error", () => {
    throw new Error("Simulated unhandled internal server error");
  });
}

// Health Check Endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "CareGuide Doctor Tracker API is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Root Information Endpoint
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to CareGuide Doctor Tracker API",
    version: "1.0.0",
  });
});

// Error Handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
