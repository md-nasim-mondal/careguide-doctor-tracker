import bcryptjs from "bcryptjs";
import { Types } from "mongoose";
import { envVars } from "../config/env";
import { Doctor } from "../modules/doctor/doctor.model";
import { Patient } from "../modules/patient/patient.model";
import { IAuthProvider, IsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { IDoctor } from "../modules/doctor/doctor.interface";

export interface IDoctorWithId extends IDoctor {
  _id: Types.ObjectId;
}

const SAMPLE_DOCTORS = [
  {
    name: "Dr. Ayesha Rahman",
    specialization: "Cardiology",
    hospital: "City Heart Center, Dhaka",
    phone: "01711000101",
    email: "ayesha.rahman@careguide.local",
  },
  {
    name: "Dr. Tanvir Hossain",
    specialization: "Neurology",
    hospital: "National Neuroscience Hospital",
    phone: "01711000102",
    email: "tanvir.hossain@careguide.local",
  },
  {
    name: "Dr. Farhana Islam",
    specialization: "Pediatrics",
    hospital: "Dhaka Shishu Hospital",
    phone: "01711000103",
    email: "farhana.islam@careguide.local",
  },
  {
    name: "Dr. Mahfuzur Rahman",
    specialization: "Orthopedics",
    hospital: "General Trauma Center",
    phone: "01711000104",
    email: "mahfuzur.rahman@careguide.local",
  },
  {
    name: "Dr. Nusrat Jahan",
    specialization: "Dermatology",
    hospital: "Skin & Laser Center",
    phone: "01711000105",
    email: "nusrat.jahan@careguide.local",
  },
  {
    name: "Dr. Zahid Hasan",
    specialization: "Gastroenterology",
    hospital: "Apollo Specialized Hospital",
    phone: "01711000106",
    email: "zahid.hasan@careguide.local",
  },
  {
    name: "Dr. Sadia Sultana",
    specialization: "Endocrinology",
    hospital: "BIRDEM General Hospital",
    phone: "01711000107",
    email: "sadia.sultana@careguide.local",
  },
  {
    name: "Dr. Imran Khan",
    specialization: "Pulmonology",
    hospital: "Chest Disease Hospital",
    phone: "01711000108",
    email: "imran.khan@careguide.local",
  },
  {
    name: "Dr. Shirin Akter",
    specialization: "Oncology",
    hospital: "Cancer Research Institute",
    phone: "01711000109",
    email: "shirin.akter@careguide.local",
  },
  {
    name: "Dr. Rafiqul Alam",
    specialization: "Nephrology",
    hospital: "Kidney Foundation Hospital",
    phone: "01711000110",
    email: "rafiqul.alam@careguide.local",
  },
  {
    name: "Dr. Tasnim Ara",
    specialization: "Gynecology",
    hospital: "Care General Hospital",
    phone: "01711000111",
    email: "tasnim.ara@careguide.local",
  },
  {
    name: "Dr. Anisur Rahman",
    specialization: "Urology",
    hospital: "Metropolitan Urology Clinic",
    phone: "01711000112",
    email: "anisur.rahman@careguide.local",
  },
  {
    name: "Dr. Fahmida Sultana",
    specialization: "Ophthalmology",
    hospital: "Eye Hospital & Institute",
    phone: "01711000113",
    email: "fahmida.sultana@careguide.local",
  },
  {
    name: "Dr. Kamrul Ahsan",
    specialization: "ENT Specialist",
    hospital: "Central ENT Center",
    phone: "01711000114",
    email: "kamrul.ahsan@careguide.local",
  },
  {
    name: "Dr. Sabrina Chowdhury",
    specialization: "Psychiatry",
    hospital: "Mental Health Institute",
    phone: "01711000115",
    email: "sabrina.chowdhury@careguide.local",
  },
  {
    name: "Dr. Mizanur Rahman",
    specialization: "Cardiology",
    hospital: "Evercare Hospital Dhaka",
    phone: "01711000116",
    email: "mizanur.rahman@careguide.local",
  },
  {
    name: "Dr. Sharmin Sultana",
    specialization: "Pediatrics",
    hospital: "Square Hospital",
    phone: "01711000117",
    email: "sharmin.sultana@careguide.local",
  },
  {
    name: "Dr. Asif Mahmud",
    specialization: "Orthopedics",
    hospital: "United Hospital",
    phone: "01711000118",
    email: "asif.mahmud@careguide.local",
  },
  {
    name: "Dr. Nadia Haque",
    specialization: "Internal Medicine",
    hospital: "Popular Diagnostic Center",
    phone: "01711000119",
    email: "nadia.haque@careguide.local",
  },
  {
    name: "Dr. Tariqul Islam",
    specialization: "General Surgery",
    hospital: "Dhaka Medical College Hospital",
    phone: "01711000120",
    email: "tariqul.islam@careguide.local",
  },
];

const SAMPLE_PATIENTS = [
  { name: "Rahim Uddin", age: 45, condition: "Hypertension", phone: "01811000201", email: "rahim.uddin@careguide.local" },
  { name: "Fatema Begum", age: 38, condition: "Type 2 Diabetes", phone: "01811000202", email: "fatema.begum@careguide.local" },
  { name: "Monirul Islam", age: 52, condition: "Coronary Artery Disease", phone: "01811000203", email: "monirul.islam@careguide.local" },
  { name: "Salma Khatun", age: 29, condition: "Asthma", phone: "01811000204", email: "salma.khatun@careguide.local" },
  { name: "Abdul Karim", age: 61, condition: "Chronic Kidney Disease", phone: "01811000205", email: "abdul.karim@careguide.local" },
  { name: "Nasima Akter", age: 34, condition: "Migraine", phone: "01811000206", email: "nasima.akter@careguide.local" },
  { name: "Kamal Hossain", age: 48, condition: "Osteoarthritis", phone: "01811000207", email: "kamal.hossain@careguide.local" },
  { name: "Ruma Parvin", age: 26, condition: "Hyperthyroidism", phone: "01811000208", email: "ruma.parvin@careguide.local" },
  { name: "Golam Mostafa", age: 55, condition: "Gastritis & GERD", phone: "01811000209", email: "golam.mostafa@careguide.local" },
  { name: "Tahmina Sultana", age: 42, condition: "Eczema", phone: "01811000210", email: "tahmina.sultana@careguide.local" },
  { name: "Zubair Ahmed", age: 19, condition: "Allergic Rhinitis", phone: "01811000211", email: "zubair.ahmed@careguide.local" },
  { name: "Hasina Banu", age: 67, condition: "Hypertension", phone: "01811000212", email: "hasina.banu@careguide.local" },
  { name: "Anwar Hossain", age: 50, condition: "Type 2 Diabetes", phone: "01811000213", email: "anwar.hossain@careguide.local" },
  { name: "Mehnaz Kabir", age: 31, condition: "Anxiety & Insomnia", phone: "01811000214", email: "mehnaz.kabir@careguide.local" },
  { name: "Shakil Khan", age: 24, condition: "Sports Injury (Ligament Tear)", phone: "01811000215", email: "shakil.khan@careguide.local" },
  { name: "Rehana Begum", age: 58, condition: "Cataract", phone: "01811000216", email: "rehana.begum@careguide.local" },
  { name: "Biplob Sen", age: 44, condition: "Kidney Stones", phone: "01811000217", email: "biplob.sen@careguide.local" },
  { name: "Nilufar Yasmin", age: 36, condition: "PCOS", phone: "01811000218", email: "nilufar.yasmin@careguide.local" },
  { name: "Hafizur Rahman", age: 63, condition: "COPD", phone: "01811000219", email: "hafizur.rahman@careguide.local" },
  { name: "Shamim Reza", age: 41, condition: "Lumbar Disc Herniation", phone: "01811000220", email: "shamim.reza@careguide.local" },
  { name: "Farzana Yasmin", age: 33, condition: "Hypothyroidism", phone: "01811000221", email: "farzana.yasmin@careguide.local" },
  { name: "Jashim Uddin", age: 49, condition: "Psoriasis", phone: "01811000222", email: "jashim.uddin@careguide.local" },
];

export const seedMockData = async (): Promise<void> => {
  try {
    const saltRounds = Number(envVars.BCRYPT_SALT_ROUND) || 10;
    const defaultDoctorPassword = await bcryptjs.hash("Doctor@1234", saltRounds);
    const defaultPatientPassword = await bcryptjs.hash("Patient@1234", saltRounds);

    const doctorCount = await Doctor.countDocuments();
    let createdDoctors: IDoctorWithId[] = [];

    // 1. Seed at least 20 Doctors if DB has fewer than 10
    if (doctorCount < 10) {
      console.log(`🌱 Seeding mock Doctors (current count: ${doctorCount})...`);
      for (const docData of SAMPLE_DOCTORS) {
        const existing = await Doctor.findOne({ email: docData.email });
        if (!existing) {
          const newDoc = await Doctor.create(docData);
          createdDoctors.push(newDoc as unknown as IDoctorWithId);

          // Create User login for doctor
          const userExists = await User.findOne({ email: docData.email });
          if (!userExists) {
            const authProvider: IAuthProvider = {
              provider: "credentials",
              providerId: docData.email,
            };
            await User.create({
              name: docData.name,
              email: docData.email,
              phone: docData.phone,
              password: defaultDoctorPassword,
              role: Role.DOCTOR,
              isActive: IsActive.ACTIVE,
              isVerified: true,
              auths: [authProvider],
            });
          }
        } else {
          createdDoctors.push(existing as unknown as IDoctorWithId);
        }
      }
      console.log(`✅ Seeded ${createdDoctors.length} Doctors.`);
    } else {
      createdDoctors = (await Doctor.find({})) as unknown as IDoctorWithId[];
    }

    // 2. Seed at least 20 Patients if DB has fewer than 10
    const patientCount = await Patient.countDocuments();
    if (patientCount < 10 && createdDoctors.length > 0) {
      console.log(`🌱 Seeding mock Patients (current count: ${patientCount})...`);
      let seededPatients = 0;
      for (let i = 0; i < SAMPLE_PATIENTS.length; i++) {
        const patData = SAMPLE_PATIENTS[i];
        const existing = await Patient.findOne({ email: patData.email });
        if (!existing) {
          // Link patient to doctors round-robin
          const assignedDoctor = createdDoctors[i % createdDoctors.length];
          await Patient.create({
            ...patData,
            doctor: assignedDoctor._id,
          });

          // Create User login for patient
          const userExists = await User.findOne({ email: patData.email });
          if (!userExists) {
            const authProvider: IAuthProvider = {
              provider: "credentials",
              providerId: patData.email,
            };
            await User.create({
              name: patData.name,
              email: patData.email,
              phone: patData.phone,
              password: defaultPatientPassword,
              role: Role.PATIENT,
              isActive: IsActive.ACTIVE,
              isVerified: true,
              auths: [authProvider],
            });
          }
          seededPatients++;
        }
      }
      console.log(`✅ Seeded ${seededPatients} Patients.`);
    }
  } catch (error) {
    console.error("⚠️ Error while seeding mock data:", error);
  }
};
