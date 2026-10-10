# CareGuide Doctor Tracker

A secure administrative web application that allows authenticated users to manage doctors and their corresponding patients. The system focuses on performance optimization, clean UX, and data visualization.

## Setup Instructions

1. Clone the repository
2. Server Setup:
   ```bash
   cd server
   pnpm install
   cp .env.example .env
   # Add your MongoDB connection string in .env
   pnpm run dev
   ```
3. Client Setup:
   ```bash
   cd client
   pnpm install
   pnpm run dev
   ```

## System Architecture
The application follows a modern separated frontend/backend architecture.
- **Frontend**: Next.js 16 (App Router) + React 19 + Tailwind CSS, interacting with backend via REST APIs.
- **Backend**: Node.js + Express + MongoDB (Mongoose), featuring custom JWT authentication middleware and modular controllers.

## Technical Decisions
1. **Next.js App Router vs Pages Router**: Chose App Router to leverage React Server Components where applicable and improve data fetching patterns.
2. **MongoDB Aggregation for Dashboard**: Used Mongoose aggregations directly on the backend to avoid heavy frontend calculations and multiple sequential requests, drastically improving dashboard load speeds.

## API Documentation
- `POST /api/v1/auth/login` - Authenticate
- `GET /api/v1/dashboard` - Fetch overview stats
- `GET /api/v1/doctors` - Fetch doctors (supports pagination & search)
- `GET /api/v1/patients` - Fetch patients

## Build Commands
- Server: `pnpm build`
- Client: `pnpm build`
