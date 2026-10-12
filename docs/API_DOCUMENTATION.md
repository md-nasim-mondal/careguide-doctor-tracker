# DocPulse REST API Documentation

Comprehensive technical documentation for the **DocPulse Doctor & Patient Tracking System** RESTful API (`v1`).

---

## 📑 Table of Contents
1. [Overview & Standards](#overview--standards)
2. [Base URL & Network Configuration](#base-url--network-configuration)
3. [Authentication & Authorization (RBAC)](#authentication--authorization-rbac)
4. [Standard API Responses](#standard-api-responses)
5. [Endpoints Specification](#endpoints-specification)
   - [1. Authentication Module (`/api/v1/auth`)](#1-authentication-module)
   - [2. User Management Module (`/api/v1/user`)](#2-user-management-module)
   - [3. Doctor Management Module (`/api/v1/doctors`)](#3-doctor-management-module)
   - [4. Patient Management Module (`/api/v1/patients`)](#4-patient-management-module)
   - [5. Dashboard Analytics Module (`/api/v1/dashboard`)](#5-dashboard-analytics-module)
   - [6. Contact Inquiries Module (`/api/v1/contact`)](#6-contact-inquiries-module)
   - [7. System & Postman Utilities](#7-system--postman-utilities)
6. [Error Handling & Diagnostic Codes](#error-handling--diagnostic-codes)
7. [Postman Collection Integration](#postman-collection-integration)

---

## Overview & Standards

* **Protocol:** HTTP / HTTPS
* **Format:** JSON (`application/json; charset=utf-8`)
* **Architecture:** Modular REST with Express.js 5 & Mongoose ODM
* **Security:** Helmet headers, CORS credentials, rate limiting (200 req / 15 min), and HttpOnly cookie-based JWT sessions.

---

## Base URL & Network Configuration

| Environment | Base URL |
| :--- | :--- |
| **Local Development** | `http://localhost:5000/api/v1` |
| **Server Root & Landing** | `http://localhost:5000/` |
| **Postman JSON Direct** | `http://localhost:5000/postman.json` |

---

## Authentication & Authorization (RBAC)

Authentication uses **JSON Web Tokens (JWT)**.
Upon successful login, clients receive:
1. `accessToken` (returned in response payload and accepted in `Authorization: Bearer <accessToken>` header).
2. `refreshToken` and `token` set automatically in **secure, HttpOnly cookies**.

### Supported System Roles
* **`SUPER_ADMIN`**: Full administrative jurisdiction over doctors, patients, users, approvals, reassignments, and system analytics.
* **`ADMIN`**: Hospital operational staff; manage doctors and patients, assign specialists, review contact inquiries.
* **`DOCTOR`**: Clinical specialist; manage assigned patient roster, edit patient clinical notes, review available specialists.
* **`PATIENT`**: Registered patient; view own medical chart, assigned attending doctor, and hospital directory.

---

## Standard API Responses

### 1. Success Response Structure
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation executed successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPage": 5
  }
}
```

### 2. Error Response Structure
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errorMessages": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ],
  "stack": "Error: ... (in development only)"
}
```

---

## Endpoints Specification

---

### 1. Authentication Module
Prefix: `/api/v1/auth`

#### `POST /auth/login`
Authenticate with email and password to start a session.
* **Access:** Public
* **Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin_password_123"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "needsPasswordChange": false
  }
}
```
* **Cookies Set:** `refreshToken` (HttpOnly), `token` (HttpOnly)

---

#### `POST /auth/refresh-token`
Generate a fresh access token using the stored `refreshToken` cookie.
* **Access:** Public (Requires `refreshToken` cookie)
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Access token generated successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### `POST /auth/logout`
Terminates the session and purges auth cookies.
* **Access:** Public
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully",
  "data": null
}
```

---

#### `POST /auth/change-password`
Change password for the currently authenticated user.
* **Access:** All Roles (`SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `PATIENT`)
* **Headers:** `Authorization: Bearer <accessToken>`
* **Request Body:**
```json
{
  "oldPassword": "old_password_here",
  "newPassword": "new_secure_password_123"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully",
  "data": null
}
```

---

#### `POST /auth/forgot-password`
Initiate password recovery. Generates a reset token and sends it to the registered email (or logs it in development).
* **Access:** Public
* **Request Body:**
```json
{
  "email": "user@example.com"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset instructions sent successfully",
  "data": null
}
```

---

#### `POST /auth/reset-password`
Reset account password using reset token verification.
* **Access:** Authenticated / Reset Token Holder
* **Headers:** `Authorization: Bearer <resetToken>`
* **Request Body:**
```json
{
  "id": "673f4e1b8c2e1a0012345678",
  "newPassword": "brand_new_password_123"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successful",
  "data": null
}
```

---

### 2. User Management Module
Prefix: `/api/v1/user`

#### `POST /user/register`
Self-register a new Patient or Doctor account.
* **Access:** Public
* **Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "janesmith@example.com",
  "password": "Password@1234",
  "role": "PATIENT",
  "phone": "+8801700000001",
  "address": "Dhaka, Bangladesh"
}
```
* **Note for Doctors:** Registering with `role: "DOCTOR"` sets `isActive: "INACTIVE"` pending administrative approval.
* **Success Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "_id": "6741b2e4f01a2b0012345678",
    "name": "Jane Smith",
    "email": "janesmith@example.com",
    "role": "PATIENT",
    "isVerified": false,
    "isActive": "ACTIVE"
  }
}
```

---

#### `GET /user/me`
Retrieve currently logged-in user profile.
* **Access:** All Roles (`SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `PATIENT`)
* **Headers:** `Authorization: Bearer <accessToken>`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "6741b2e4f01a2b0012345678",
    "name": "Dr. John Doe",
    "email": "john.doe@example.com",
    "role": "DOCTOR",
    "phone": "+8801711223344",
    "isVerified": true,
    "isActive": "ACTIVE",
    "createdAt": "2026-10-10T12:00:00.000Z"
  }
}
```

---

#### `GET /user/all-users`
Retrieve paginated user directory.
* **Access:** `SUPER_ADMIN`, `ADMIN`
* **Query Parameters:**
  - `page` *(optional, default: 1)*
  - `limit` *(optional, default: 10)*
  - `search` *(optional, search by name or email)*
  - `role` *(optional, filter by SUPER_ADMIN, ADMIN, DOCTOR, PATIENT)*
  - `isActive` *(optional, filter by ACTIVE, INACTIVE, BLOCKED)*
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 35,
    "totalPage": 4
  },
  "data": [ ... ]
}
```

---

#### `PATCH /user/:id/approve-doctor`
Approve a pending Doctor registration, transitioning status from `INACTIVE` to `ACTIVE` and synchronizing with doctor directory.
* **Access:** `SUPER_ADMIN`, `ADMIN`
* **URL Params:** `id` (User ObjectId)
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Doctor account approved and activated successfully",
  "data": { ... }
}
```

---

#### `PATCH /user/:id`
Update an existing user's role or status.
* **Access:** `SUPER_ADMIN`, `ADMIN` (Or self for profile details)
* **Request Body:**
```json
{
  "name": "Jane Smith",
  "phone": "+8801811223344",
  "role": "PATIENT",
  "isActive": "ACTIVE"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User updated successfully",
  "data": { ... }
}
```

---

#### `DELETE /user/:id`
Delete or soft-delete a user account.
* **Access:** `SUPER_ADMIN`, `ADMIN`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User deleted successfully",
  "data": null
}
```

---

### 3. Doctor Management Module
Prefix: `/api/v1/doctors`

#### `GET /doctors`
Retrieve list of verified doctors with patient count analytics.
* **Access:** All Roles (`SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `PATIENT`)
* **Query Parameters:**
  - `search` *(search by doctor name or email)*
  - `specialization` *(e.g. Cardiology, Neurology, Pediatrics)*
  - `date` *(filter by registration date `YYYY-MM-DD`)*
  - `page` *(default: 1)*
  - `limit` *(default: 10)*
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Doctors retrieved successfully",
  "data": {
    "doctors": [
      {
        "_id": "673f4e1b8c2e1a0011111111",
        "name": "Dr. Sarah Connor",
        "email": "sarah.connor@hospital.org",
        "phone": "+8801712345678",
        "specialization": "Cardiology",
        "hospital": "DocPulse Heart Center",
        "createdAt": "2026-10-01T08:00:00.000Z"
      }
    ],
    "total": 20
  }
}
```

---

#### `GET /doctors/:id`
Fetch single doctor profile with hospital chamber credentials.
* **Access:** All Roles

---

#### `POST /doctors`
Create a new doctor entry manually.
* **Access:** `SUPER_ADMIN`, `ADMIN`
* **Request Body:**
```json
{
  "name": "Dr. Gregory House",
  "email": "gregory.house@docpulse.local",
  "phone": "+8801700998877",
  "specialization": "Diagnostic Medicine",
  "hospital": "Princeton-Plainsboro Hospital"
}
```
* **Success Response (201 Created)**

---

#### `PUT /doctors/:id`
Update doctor credentials, chamber location, or contact details.
* **Access:** `SUPER_ADMIN`, `ADMIN`

---

#### `DELETE /doctors/:id`
Delete a doctor record with **Cascade Integrity Safeguards**.
* **Access:** `SUPER_ADMIN`, `ADMIN`
* **Integrity Guard:** If the doctor has active patients currently assigned, deletion is blocked with a `400 Bad Request` informing the administrator to reassign active patients first.
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Doctor deleted successfully",
  "data": null
}
```

---

#### `GET /doctors/:id/patients`
Retrieve all patients assigned to a specific doctor.
* **Access:** `SUPER_ADMIN`, `ADMIN`, `DOCTOR`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Assigned patients retrieved successfully",
  "data": [
    {
      "_id": "673f4e1b8c2e1a0022222222",
      "name": "Alice Cooper",
      "age": 42,
      "condition": "Arrhythmia",
      "createdAt": "2026-10-05T10:15:00.000Z"
    }
  ]
}
```

---

### 4. Patient Management Module
Prefix: `/api/v1/patients`

#### `GET /patients`
Retrieve patient registry with automatic RBAC scoping.
* **Access & Behavior:**
  - `SUPER_ADMIN`, `ADMIN`: Receives all hospital patients across all doctors.
  - `DOCTOR`: Scoped strictly to patients assigned under the requesting doctor's ID.
  - `PATIENT`: Scoped strictly to the requesting user's own single patient record.
* **Query Parameters:**
  - `search` *(search by patient name)*
  - `condition` *(filter by diagnosed condition)*
  - `date` *(registration date filter)*
  - `doctorId` *(filter by assigned physician)*
  - `page` & `limit`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Patients retrieved successfully",
  "data": {
    "patients": [
      {
        "_id": "673f4e1b8c2e1a0033333333",
        "name": "Michael Brown",
        "age": 55,
        "condition": "Type 2 Diabetes",
        "doctor": {
          "_id": "673f4e1b8c2e1a0011111111",
          "name": "Dr. Sarah Connor",
          "specialization": "Endocrinology"
        },
        "createdAt": "2026-10-08T09:30:00.000Z"
      }
    ],
    "total": 85
  }
}
```

---

#### `GET /patients/conditions`
Returns an array of all distinct diagnosed medical conditions currently registered.
* **Access:** All Roles
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Medical conditions retrieved successfully",
  "data": [
    "Hypertension",
    "Type 2 Diabetes",
    "Arrhythmia",
    "Asthma",
    "Post-Op Monitoring",
    "General Health Checkup"
  ]
}
```

---

#### `POST /patients`
Register a new patient and assign to an attending physician.
* **Access:** `SUPER_ADMIN`, `ADMIN`, `DOCTOR`
* **Request Body:**
```json
{
  "name": "Robert Downey",
  "age": 48,
  "condition": "Hypertension",
  "doctor": "673f4e1b8c2e1a0011111111"
}
```
* **Success Response (201 Created)**

---

#### `PUT /patients/:id`
Update patient clinical condition, attending doctor assignment, or medical notes.
* **Access:** `SUPER_ADMIN`, `ADMIN`, `DOCTOR` (attending doctor only)

---

#### `DELETE /patients/:id`
Delete a patient record.
* **Access:** `SUPER_ADMIN`, `ADMIN`

---

### 5. Dashboard Analytics Module
Prefix: `/api/v1/dashboard`

#### `GET /dashboard/analytics`
Executes real-time MongoDB aggregation pipelines to calculate hospital KPI metrics.
* **Access:** `SUPER_ADMIN`, `ADMIN`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Dashboard analytics generated successfully",
  "data": {
    "totalDoctors": 20,
    "totalPatients": 85,
    "patientsPerDoctor": [
      {
        "doctorName": "Dr. Sarah Connor",
        "patientCount": 14
      },
      {
        "doctorName": "Dr. Gregory House",
        "patientCount": 9
      }
    ],
    "registrationsOverTime": [
      {
        "date": "2026-10-06",
        "count": 4
      },
      {
        "date": "2026-10-07",
        "count": 7
      },
      {
        "date": "2026-10-08",
        "count": 12
      }
    ]
  }
}
```

---

### 6. Contact Inquiries Module
Prefix: `/api/v1/contact`

#### `POST /contact`
Submit a patient or clinic inquiry from the public portal.
* **Access:** Public
* **Request Body:**
```json
{
  "name": "Alex Taylor",
  "email": "alex.taylor@example.com",
  "phone": "+8801912345678",
  "subject": "Clinic Partnership Inquiry",
  "message": "Hello, we would like to onboard 15 specialists into the DocPulse tracker."
}
```
* **Success Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Inquiry submitted successfully",
  "data": { ... }
}
```

---

#### `GET /contact`
Retrieve submitted inquiries for administrator review.
* **Access:** `SUPER_ADMIN`, `ADMIN`
* **Query Parameters:** `page`, `limit`

---

### 7. System & Postman Utilities

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Responsive HTML Landing & Status Dashboard with real-time health checks | Public |
| **GET** | `/postman.json` | Returns raw Postman v2.1 collection JSON | Public |
| **GET** | `/postman.json?download=true` | Forces direct `.json` file download for instant Postman import | Public |
| **GET** | `/api/v1/test-server-error` | Simulates an unhandled 500 error for developer exception testing | Non-Prod |

---

## Error Handling & Diagnostic Codes

| HTTP Status | Name | Meaning | Common Cause |
| :---: | :--- | :--- | :--- |
| **`200`** | OK | Request successful | Standard successful read or update |
| **`201`** | Created | Resource created | Successful registration, doctor, or patient creation |
| **`400`** | Bad Request | Validation or business constraint failed | Invalid input payload or trying to delete doctor with active patients |
| **`401`** | Unauthorized | Token missing, invalid, or expired | JWT expired, invalid credentials |
| **`403`** | Forbidden | Insufficient role permissions | Doctor attempting to view Admin analytics |
| **`404`** | Not Found | Resource does not exist | Invalid Doctor or Patient ID |
| **`429`** | Too Many Requests | Rate limit threshold exceeded | Exceeded 200 requests within 15 minutes window |
| **`500`** | Internal Server Error | Unhandled server exception | Database connectivity interruption |

---

## Postman Collection Integration

A fully configured Postman collection with automatic variable persistence (`accessToken`, `baseUrl`, `doctorId`, `patientId`) is provided with the project:

* **File Location in Repo:** `server/careguide-doctor-tracker.postman_collection.json`
* **Download Directly from Running Server:**
  ```bash
  curl -O http://localhost:5000/postman.json
  ```
* **Quick Import:** Open Postman -> Click **Import** -> Select `careguide-doctor-tracker.postman_collection.json`. The environment collection variable `baseUrl` is pre-set to `http://localhost:5000/api/v1`.
