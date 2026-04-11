# School Management Frontend

This is the frontend for the School Management Mini System. It is built with React, TypeScript, Vite, React Router, and reusable UI components.

The app connects to the backend API and provides:

- Admin registration
- Admin login
- Protected dashboard access
- Student management
- Task management

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- shadcn-style UI components

## Features

- Register a new admin account
- Login with admin credentials
- Protect dashboard routes using token-based access
- Add a student
- View all students
- Edit a student
- Delete a student
- Assign a task to a student
- View all tasks
- Mark a task as done

## Routes

- `/` - Login page
- `/register` - Register page
- `/dashboard` - Protected dashboard

## Project Structure

```text
src/
  components/
    login-form.tsx
    register-form.tsx
    ProtectedRoute.tsx
    StudentForm.tsx
    StudentList.tsx
    TaskForm.tsx
    TaskList.tsx
    ui/
  lib/
    utils.ts
  pages/
    Login.tsx
    Register.tsx
    Dashboard.tsx
  services/
    Api.ts
  types/
    index.ts
  App.tsx
  main.tsx
```

## Prerequisites

Make sure you have:

- Node.js installed
- npm installed
- The backend server running locally

Vite currently recommends Node.js `20.19+` or `22.12+`.

## Installation

From the `Frontend` folder:

```bash
npm install
```

## Run the Frontend

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Backend Requirement

This frontend expects the backend to run at:

```text
http://localhost:8000
```

The API helper is currently configured in:

- `src/services/Api.ts`

If your backend runs on a different port or host, update the `BASE_URL` there.

## API Usage

The frontend is integrated with these backend routes:

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Students

- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

### Tasks

- `GET /api/task`
- `POST /api/task`
- `PUT /api/task/:id`

## Authentication Flow

- On successful login, the JWT token is stored in `localStorage`
- Admin details are also stored in `localStorage`
- The dashboard route is protected through `ProtectedRoute`
- On logout, stored auth data is removed

## Notes

- Task creation requires a valid student to be selected
- Task status values are `pending` and `done`
- Deleting a student in the frontend also removes related tasks from the local dashboard state
- Success and error messages are shown in the UI for important actions

## How To Test

Recommended flow:

1. Register a new admin
2. Login with that admin account
3. Add one or more students
4. Edit a student
5. Delete a student
6. Assign a task to a student
7. Mark a task as done
8. Logout
9. Try opening `/dashboard` without logging in

## Submission Note

This frontend is designed specifically for the provided backend assignment and mirrors the backend modules for auth, students, and tasks.
