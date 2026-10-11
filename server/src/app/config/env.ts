import dotenv from "dotenv";

dotenv.config();

export interface EnvConfig {
  PORT: string;
  DB_URL: string;
  DB_NAME: string;
  NODE_ENV: "development" | "production";
  BCRYPT_SALT_ROUND: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  OTP_EXPIRES: string;
  RESET_PASS_EXPIRES: string;
  SUPER_ADMIN_NAME: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  SUPER_ADMIN_PHONE: string;
  FRONTEND_URL: string;
  AUTH_SYSTEM: "passport" | "custom";
  EMAIL_SENDER: {
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_FORM?: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "DB_URL",
    "JWT_ACCESS_SECRET",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT || "5000",
    DB_URL: process.env.DB_URL as string,
    DB_NAME: process.env.DB_NAME || "careguide-doctor-tracker-db",
    NODE_ENV: (process.env.NODE_ENV as "development" | "production") || "development",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND || "10",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "1d",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || (process.env.JWT_ACCESS_SECRET as string),
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "30d",
    OTP_EXPIRES: process.env.OTP_EXPIRES || "1h",
    RESET_PASS_EXPIRES: process.env.RESET_PASS_EXPIRES || "1h",
    SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME || "Super Admin",
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE || "01234567890",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    AUTH_SYSTEM: (process.env.AUTH_SYSTEM as "passport" | "custom") || "custom",
    EMAIL_SENDER: {
      SMTP_HOST: process.env.SMTP_HOST || "",
      SMTP_PORT: process.env.SMTP_PORT || "465",
      SMTP_USER: process.env.SMTP_USER || "",
      SMTP_PASS: process.env.SMTP_PASS || "",
      SMTP_FORM: process.env.SMTP_FORM || "CareGuide <no-reply@careguide.local>",
    },
  };
};

export const envVars = loadEnvVariables();
