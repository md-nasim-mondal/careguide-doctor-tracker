# Doctor Tracker

## Description
Doctor Tracker is a secure administrative web application tailored for managing doctors and their corresponding patients. It provides authenticated super admins with an interactive dashboard with visualization charts, optimized Server-Side Rendered (SSR) interfaces, and a clean user experience (UX) to manage healthcare records. The project natively scales between a Next.js (App Router) client frontend and an Express.js (Node.js) backend utilizing MongoDB for structured data storage.

## Setup Guide
To set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd careguide-doctor-tracker
   ```

2. **Backend Setup**:
   ```bash
   cd server
   pnpm install --frozen-lockfile
   cp .env.example .env
   # Make sure you have MongoDB running locally or replace DB_URL with a MongoDB Atlas URI in .env
   pnpm run dev
   ```
   *The backend runs on `http://localhost:5000` by default. Super Admin credentials can be configured in `.env` and initialized.*

3. **Frontend Setup**:
   ```bash
   cd ../client
   pnpm install --frozen-lockfile
   cp .env.example .env
   # Starts the client application
   pnpm run dev
   ```
   *The frontend runs on `http://localhost:3000`.*

## System Architecture
The application runs a clean separation of concerns:
- **Database:** MongoDB (Mongoose Schema modeling)
- **Backend Service:** Express / Node.js exposes a set of protected RESTful endpoints (`/api/v1/*`). All data queries and analytical `$group` pipelines execute securely on the Express layer.
- **Frontend Framework:** Next.js 16 (App Router) consumes the backend. 
- **Network Pipeline:** The frontend utilizes `serverApi.ts` as a native middleware bridge, ensuring tokens are exchanged securely via HTTP-Only cookies inside Next.js Server Components. Client-Side components *never* communicate with the API layer directly.

## Technical Decisions

1. **HttpOnly Cookie Implementation over LocalStorage JWTs**
   *Why we chose it:* The initial configuration allowed the browser to explicitly store JWTs inside LocalStorage, making the application vulnerable to Cross-Site Scripting (XSS) leaks and forcing Client Components to manage network requests. We migrated authentication to use strict `HttpOnly` cookies. This approach forces all secure authentication calls to be processed via Server Components and Next.js middleware (`proxy.ts`), massively minimizing the frontend bundle size and blocking all client-side JavaScript from accessing token strings directly.

2. **Next.js Server Components (RSC) vs Client Components (CSR)**
   *Why we chose it:* We leveraged React Server Components exclusively for all list rendering and native paginations (`DoctorsPage`, `PatientsPage`) instead of traditional CSR `useEffect` hydration blocks. This ensures Next.js performs network interactions natively alongside the Node.js server, pre-building HTML skeletons, preventing "flickering" UI, scaling SEO potential, and securing `BACKEND_API_URL` solely behind Node's private networking scope. Interactivity (Form modals, pagination buttons, `recharts`) was stripped to isolated Client "Shells" rendering only explicit, sanitized inputs.

## Visual Evidence

### Dashboard (Desktop)
![Dashboard Desktop](docs/screenshots/dashboard_desktop.png)

### Dashboard (Mobile)
![Dashboard Mobile](docs/screenshots/dashboard_mobile.png)

### Doctors List
![Doctors List](docs/screenshots/doctors_desktop.png)

### Patients List
![Patients List](docs/screenshots/patients_desktop.png)

### Analytics Dashboard
![Analytics](docs/screenshots/analytics_desktop.png)
