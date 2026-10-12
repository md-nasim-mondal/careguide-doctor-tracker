import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { Doctor } from "../modules/doctor/doctor.model";
import { Patient } from "../modules/patient/patient.model";
import { IAuthProvider, IsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

/**
 * Synchronizes all existing Doctors and Patients in MongoDB with the User collection.
 * Ensures that all Doctors and Patients have active User records and appear in User Management.
 */
export const syncDoctorsAndPatientsToUsers = async (): Promise<void> => {
  try {
    const saltRounds = Number(envVars.BCRYPT_SALT_ROUND) || 10;
    const defaultDoctorPassword = await bcryptjs.hash("Doctor@1234", saltRounds);
    const defaultPatientPassword = await bcryptjs.hash("Patient@1234", saltRounds);

    // 1. Migrate any legacy roles in User collection (SENDER -> DOCTOR, RECEIVER -> PATIENT)
    await User.updateMany({ role: "SENDER" as any }, { role: Role.DOCTOR });
    await User.updateMany({ role: "RECEIVER" as any }, { role: Role.PATIENT });

    // 2. Synchronize all Doctors to Users
    const allDoctors = await Doctor.find({});
    for (const doc of allDoctors) {
      if (!doc.email) continue;
      const existingUser = await User.findOne({ email: doc.email });
      if (!existingUser) {
        const authProvider: IAuthProvider = {
          provider: "credentials",
          providerId: doc.email,
        };
        await User.create({
          name: doc.name,
          email: doc.email,
          phone: doc.phone || "01700000000",
          password: defaultDoctorPassword,
          role: Role.DOCTOR,
          isActive: IsActive.ACTIVE,
          isVerified: true,
          auths: [authProvider],
        });
      } else {
        let changed = false;
        if (existingUser.role !== Role.DOCTOR && existingUser.role !== Role.SUPER_ADMIN && existingUser.role !== Role.ADMIN) {
          existingUser.role = Role.DOCTOR;
          changed = true;
        }
        if (!existingUser.isVerified) {
          existingUser.isVerified = true;
          changed = true;
        }
        if (changed) {
          await existingUser.save();
        }
      }
    }

    // 3. Synchronize all Patients to Users
    const allPatients = await Patient.find({});
    for (const pat of allPatients) {
      let patientEmail = (pat as any).email;
      if (!patientEmail) {
        const cleanName = pat.name.toLowerCase().replace(/[^a-z0-9]/g, "") || "patient";
        patientEmail = `${cleanName}_${pat._id.toString().slice(-4)}@careguide.local`;
        (pat as any).email = patientEmail;
        await pat.save();
      }

      const existingUser = await User.findOne({ email: patientEmail });
      if (!existingUser) {
        const authProvider: IAuthProvider = {
          provider: "credentials",
          providerId: patientEmail,
        };
        await User.create({
          name: pat.name,
          email: patientEmail,
          phone: (pat as any).phone || "01700000000",
          password: defaultPatientPassword,
          role: Role.PATIENT,
          isActive: IsActive.ACTIVE,
          isVerified: true,
          auths: [authProvider],
        });
      } else if (existingUser.role !== Role.PATIENT && existingUser.role !== Role.SUPER_ADMIN && existingUser.role !== Role.ADMIN && existingUser.role !== Role.DOCTOR) {
        existingUser.role = Role.PATIENT;
        await existingUser.save();
      }
    }
  } catch (error) {
    console.error("⚠️ Failed to synchronize doctors and patients to Users collection:", error);
  }
};
