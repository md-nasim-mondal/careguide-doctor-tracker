import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.route";
import { ContactRoutes } from "../modules/contact/contact.route";

export const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/user", route: UserRoutes },
  { path: "/doctors", route: DoctorRoutes },
  { path: "/patients", route: PatientRoutes },
  { path: "/dashboard", route: DashboardRoutes },
  { path: "/contact", route: ContactRoutes }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
