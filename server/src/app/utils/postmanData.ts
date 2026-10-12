export const careguidePostmanCollection = {
  info: {
    _postman_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    name: "DocPulse Doctor Tracker API",
    description: "Complete API collection for DocPulse Doctor Tracker system. Includes Authentication, Users, Doctors, Patients, Dashboard Analytics, and Contact modules.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    {
      key: "baseUrl",
      value: "http://localhost:5000/api/v1",
      type: "string"
    },
    {
      key: "accessToken",
      value: "",
      type: "string"
    },
    {
      key: "doctorId",
      value: "",
      type: "string"
    },
    {
      key: "patientId",
      value: "",
      type: "string"
    },
    {
      key: "userId",
      value: "",
      type: "string"
    }
  ],
  item: [
    {
      name: "1. Authentication",
      item: [
        {
          name: "Login (Credentials)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "if (pm.response.code === 200) {",
                  "    var jsonData = pm.response.json();",
                  "    if (jsonData.data && jsonData.data.accessToken) {",
                  "        pm.collectionVariables.set('accessToken', jsonData.data.accessToken);",
                  "        console.log('AccessToken automatically saved to collection variable!');",
                  "    }",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  email: "admin@careguide.local",
                  password: "AdminPassword123!"
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/auth/login",
              host: ["{{baseUrl}}"],
              path: ["auth", "login"]
            },
            description: "Authenticate with email and password to receive access & refresh tokens."
          }
        },
        {
          name: "Refresh Token",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{baseUrl}}/auth/refresh-token",
              host: ["{{baseUrl}}"],
              path: ["auth", "refresh-token"]
            },
            description: "Request a new access token using the httpOnly refreshToken cookie."
          }
        },
        {
          name: "Logout",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{baseUrl}}/auth/logout",
              host: ["{{baseUrl}}"],
              path: ["auth", "logout"]
            },
            description: "Clears auth cookies and logs out the user."
          }
        },
        {
          name: "Change Password",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              },
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  oldPassword: "AdminPassword123!",
                  newPassword: "NewSecretPassword123!"
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/auth/change-password",
              host: ["{{baseUrl}}"],
              path: ["auth", "change-password"]
            }
          }
        },
        {
          name: "Forgot Password",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  email: "admin@careguide.local"
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/auth/forgot-password",
              host: ["{{baseUrl}}"],
              path: ["auth", "forgot-password"]
            }
          }
        },
        {
          name: "Reset Password",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              },
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  email: "admin@careguide.local",
                  verificationCode: "123456",
                  newPassword: "AdminPassword123!"
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/auth/reset-password",
              host: ["{{baseUrl}}"],
              path: ["auth", "reset-password"]
            }
          }
        }
      ]
    },
    {
      name: "2. User Management",
      item: [
        {
          name: "Register User",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  name: "New Doctor User",
                  email: "new.doctor@careguide.local",
                  password: "DoctorPassword123!",
                  phone: "01799887766",
                  role: "DOCTOR"
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/user/register",
              host: ["{{baseUrl}}"],
              path: ["user", "register"]
            }
          }
        },
        {
          name: "Get Current Profile (/me)",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/user/me",
              host: ["{{baseUrl}}"],
              path: ["user", "me"]
            }
          }
        },
        {
          name: "Get All Users (Admin)",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/user/all-users?page=1&limit=10",
              host: ["{{baseUrl}}"],
              path: ["user", "all-users"],
              query: [
                { key: "page", value: "1" },
                { key: "limit", value: "10" }
              ]
            }
          }
        },
        {
          name: "Get Single User",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/user/{{userId}}",
              host: ["{{baseUrl}}"],
              path: ["user", "{{userId}}"]
            }
          }
        },
        {
          name: "Approve Doctor (Admin)",
          request: {
            method: "PATCH",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/user/{{userId}}/approve-doctor",
              host: ["{{baseUrl}}"],
              path: ["user", "{{userId}}", "approve-doctor"]
            }
          }
        },
        {
          name: "Update User",
          request: {
            method: "PATCH",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              },
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  name: "Updated Doctor Name",
                  phone: "01711223344"
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/user/{{userId}}",
              host: ["{{baseUrl}}"],
              path: ["user", "{{userId}}"]
            }
          }
        },
        {
          name: "Delete User (Admin)",
          request: {
            method: "DELETE",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/user/{{userId}}",
              host: ["{{baseUrl}}"],
              path: ["user", "{{userId}}"]
            }
          }
        }
      ]
    },
    {
      name: "3. Doctors",
      item: [
        {
          name: "Get All Doctors",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/doctors?searchTerm=&specialization=&hospital=&page=1&limit=10&sortBy=createdAt&sortOrder=desc",
              host: ["{{baseUrl}}"],
              path: ["doctors"],
              query: [
                { key: "searchTerm", value: "" },
                { key: "specialization", value: "" },
                { key: "hospital", value: "" },
                { key: "page", value: "1" },
                { key: "limit", value: "10" },
                { key: "sortBy", value: "createdAt" },
                { key: "sortOrder", value: "desc" }
              ]
            }
          }
        },
        {
          name: "Create Doctor (Admin)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              },
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  name: "Dr. Rafiqul Islam",
                  specialization: "Cardiology",
                  hospital: "Apollo Hospital, Dhaka",
                  phone: "01819123456",
                  email: "dr.rafiqul@careguide.local"
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/doctors",
              host: ["{{baseUrl}}"],
              path: ["doctors"]
            }
          }
        },
        {
          name: "Get Doctor By ID",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/doctors/{{doctorId}}",
              host: ["{{baseUrl}}"],
              path: ["doctors", "{{doctorId}}"]
            }
          }
        },
        {
          name: "Update Doctor (Admin)",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              },
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  hospital: "Evercare Hospital, Dhaka",
                  phone: "01819999999"
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/doctors/{{doctorId}}",
              host: ["{{baseUrl}}"],
              path: ["doctors", "{{doctorId}}"]
            }
          }
        },
        {
          name: "Delete Doctor (Admin)",
          request: {
            method: "DELETE",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/doctors/{{doctorId}}",
              host: ["{{baseUrl}}"],
              path: ["doctors", "{{doctorId}}"]
            }
          }
        },
        {
          name: "Get Doctor's Patients",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/doctors/{{doctorId}}/patients",
              host: ["{{baseUrl}}"],
              path: ["doctors", "{{doctorId}}", "patients"]
            }
          }
        },
        {
          name: "Add Patient to Doctor",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              },
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  patientId: "{{patientId}}"
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/doctors/{{doctorId}}/patients",
              host: ["{{baseUrl}}"],
              path: ["doctors", "{{doctorId}}", "patients"]
            }
          }
        },
        {
          name: "Remove Patient from Doctor",
          request: {
            method: "DELETE",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/doctors/{{doctorId}}/patients/{{patientId}}",
              host: ["{{baseUrl}}"],
              path: ["doctors", "{{doctorId}}", "patients", "{{patientId}}"]
            }
          }
        }
      ]
    },
    {
      name: "4. Patients",
      item: [
        {
          name: "Get All Patients",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/patients?searchTerm=&condition=&page=1&limit=10",
              host: ["{{baseUrl}}"],
              path: ["patients"],
              query: [
                { key: "searchTerm", value: "" },
                { key: "condition", value: "" },
                { key: "page", value: "1" },
                { key: "limit", value: "10" }
              ]
            }
          }
        },
        {
          name: "Get Patient Conditions List",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/patients/conditions",
              host: ["{{baseUrl}}"],
              path: ["patients", "conditions"]
            }
          }
        },
        {
          name: "Create Patient",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              },
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  name: "Kazi Nazrul",
                  age: 42,
                  condition: "Hypertension",
                  doctor: "{{doctorId}}",
                  email: "kazi.nazrul@careguide.local",
                  phone: "01722334455"
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/patients",
              host: ["{{baseUrl}}"],
              path: ["patients"]
            }
          }
        },
        {
          name: "Get Patient By ID",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/patients/{{patientId}}",
              host: ["{{baseUrl}}"],
              path: ["patients", "{{patientId}}"]
            }
          }
        },
        {
          name: "Update Patient",
          request: {
            method: "PUT",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              },
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  condition: "Type 2 Diabetes (Managed)"
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/patients/{{patientId}}",
              host: ["{{baseUrl}}"],
              path: ["patients", "{{patientId}}"]
            }
          }
        },
        {
          name: "Delete Patient (Admin)",
          request: {
            method: "DELETE",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/patients/{{patientId}}",
              host: ["{{baseUrl}}"],
              path: ["patients", "{{patientId}}"]
            }
          }
        }
      ]
    },
    {
      name: "5. Dashboard & Analytics",
      item: [
        {
          name: "Get Dashboard Analytics (Admin)",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/dashboard/analytics",
              host: ["{{baseUrl}}"],
              path: ["dashboard", "analytics"]
            }
          }
        }
      ]
    },
    {
      name: "6. Contact & Inquiries",
      item: [
        {
          name: "Submit Contact Inquiry",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify(
                {
                  name: "Visitor Name",
                  email: "visitor@example.com",
                  subject: "Demo Request",
                  message: "Interested in deploying CareGuide Doctor Tracker for our regional clinics."
                },
                null,
                2
              )
            },
            url: {
              raw: "{{baseUrl}}/contact",
              host: ["{{baseUrl}}"],
              path: ["contact"]
            }
          }
        },
        {
          name: "Get All Inquiries (Admin)",
          request: {
            method: "GET",
            header: [
              {
                key: "Authorization",
                value: "Bearer {{accessToken}}"
              }
            ],
            url: {
              raw: "{{baseUrl}}/contact?page=1&limit=10",
              host: ["{{baseUrl}}"],
              path: ["contact"],
              query: [
                { key: "page", value: "1" },
                { key: "limit", value: "10" }
              ]
            }
          }
        }
      ]
    },
    {
      name: "7. System & Health",
      item: [
        {
          name: "Health Check",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5000/health",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: ["health"]
            }
          }
        },
        {
          name: "Download Postman Collection",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5000/postman.json",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: ["postman.json"]
            }
          }
        }
      ]
    }
  ]
};
