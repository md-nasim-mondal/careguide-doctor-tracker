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
import { careguidePostmanCollection } from "./app/utils/postmanData";
import { getServerLandingPageHtml } from "./app/utils/serverLandingPage";

const app = express();
app.set("trust proxy", 1);

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
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

// Postman Collection Endpoints
const servePostmanCollection = (req: Request, res: Response) => {
  const isDownload = req.query.download === "true" || req.path.includes("download");
  if (isDownload) {
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="careguide-doctor-tracker.postman_collection.json"'
    );
  }
  res.setHeader("Content-Type", "application/json");
  return res.status(200).send(JSON.stringify(careguidePostmanCollection, null, 2));
};

app.get("/postman.json", servePostmanCollection);
app.get("/download-postman", servePostmanCollection);
app.get("/api/v1/postman.json", servePostmanCollection);

// Health Check Endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "CareGuide Doctor Tracker API is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    postman: "/postman.json",
  });
});

// Root Information / Landing Page Endpoint
app.get("/", (req: Request, res: Response) => {
  // If request explicitly prefers JSON (API clients, curl, etc.)
  if (req.accepts("html") && !req.xhr && !req.headers["sec-ch-ua-platform"]?.includes("curl")) {
    const protocol = req.protocol || "http";
    const host = req.get("host") || "localhost:5000";
    const html = getServerLandingPageHtml(process.uptime(), protocol, host);
    return res.status(200).send(html);
  }

  return res.status(200).json({
    success: true,
    message: "CareGuide Doctor Tracker API Engine Online",
    version: "1.0.0",
    docs: "/api/v1",
    health: "/health",
    postmanCollection: "/postman.json",
  });
});

// Error Handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
