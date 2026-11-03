# Notifications App

A full-stack notifications app with a NestJS API backend and a React + Vite + TypeScript frontend.

## Prerequisites

- Node.js 20+
- npm
- MongoDB locally or a MongoDB Atlas connection

## Setup

Install dependencies in both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Backend environment variables

Create `backend/.env`:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `FRONTEND_ORIGIN` | Allowed frontend origin for CORS |

### Frontend environment variables

Create `frontend/.env`:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

## Run the app

Start the backend:

```bash
cd backend
npm run start:dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

## Backend tests

```bash
cd backend
npm test
```

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users/register` | Register a user |
| `POST` | `/users/login` | Log in and receive a JWT |
| `GET` | `/users/me` | Get the authenticated user |
| `GET` | `/notifications` | List the current user's notifications |
| `POST` | `/notifications` | Create a notification |
| `GET` | `/notifications/:id` | Get one notification |
| `PUT` | `/notifications/:id` | Update a notification |
| `DELETE` | `/notifications/:id` | Delete a notification |

Notification endpoints require a bearer JWT.

## Folder structure

```text
backend/    NestJS API, MongoDB schemas, authentication, and tests
frontend/   React UI, routing, auth state, and API services
```

Some `npm audit` warnings may come from development tools only and do not affect the application runtime.
