# BizFlow

BizFlow is a business operations dashboard with a React frontend and an Express API. It brings customer, project, task, and invoice management together with reporting and team administration. The API uses MongoDB and scopes business data by tenant.

## Features

- Dashboard, reports, and notifications
- Customer records and project tracking
- Task management
- Invoice creation and details
- User administration and role permissions
- Authentication, tenant membership, and audit logs

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Recharts, Axios
- **Backend:** Node.js, Express 5, TypeScript, MongoDB, Mongoose, Zod, JWT
- **Backend development and tests:** tsx and Vitest

## Requirements

- Node.js and npm
- A MongoDB database

## Run locally

1. Configure the API environment:

   ```sh
   cd server
   cp .env.example .env
   ```

   Set `MONGODB_URI`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` in `server/.env`. The example config uses port `5000`; the API defaults to `5001` if `PORT` is unset. Set `PORT=5001` so it matches the frontend's API URL (`http://localhost:5001/api`).

2. Install dependencies and start the API in one terminal:

   ```sh
   cd server
   npm install
   npm run dev
   ```

3. Install dependencies and start the frontend in another terminal:

   ```sh
   cd client
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite. The API health endpoint is available at `http://localhost:5001/api/health`.

## Available scripts

Run these from the relevant `client` or `server` directory:

| Package | Command | Purpose |
| --- | --- | --- |
| Client | `npm run dev` | Start the Vite development server |
| Client | `npm run build` | Type-check and build the frontend |
| Client | `npm run lint` | Run ESLint |
| Client | `npm run preview` | Preview a production frontend build |
| Server | `npm run dev` | Start the API with file watching |
| Server | `npm run build` | Compile the API TypeScript |
| Server | `npm start` | Run the compiled API |
| Server | `npm test` | Run the API tests with Vitest |

## API areas

API routes are mounted under `/api`: `auth`, `customers`, `projects`, `tasks`, `users`, `invoices`, `dashboard`, `reports`, `permissions`, `audit-logs`, and `notifications`.
