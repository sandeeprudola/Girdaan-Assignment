# School Management Mini System Backend

This is the backend API for a mini school management system built with Node.js, Express, and MongoDB.

Implemented modules:
- Admin authentication
- Student management
- Task management

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Features Implemented

- Admin register
- Admin login
- Protected routes using JWT
- Add student
- View all students
- Update student
- Delete student
- Assign task to a student
- View all tasks
- Mark task as done

## Project Structure

```text
src/
  config/
    db.js
  controllers/
    authController.js
    studentController.js
    taskController.js
  middlewares/
    authMiddleware.js
  models/
    Admin.js
    Student.js
    Task.js
  routes/
    authRoutes.js
    studentRoutes.js
    taskRoutes.js
  app.js
  server.js
```

## Environment Variables

Create a `.env` file in the backend root.

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Example:

```env
PORT=8000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/school-management
JWT_SECRET=mysecret123
```

## Installation

```bash
npm install
```

## Run the Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Base URL

```text
http://localhost:8000
```

## API Routes

### Health Check

- `GET /`

Response:

```json
{
  "msg": "API is live"
}
```

### Auth Routes

- `POST /api/auth/register`
- `POST /api/auth/login`

Register request body:

```json
{
  "name": "Admin",
  "email": "admin@gmail.com",
  "password": "123456"
}
```

Login request body:

```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

### Student Routes

These routes are protected. Pass a JWT token in the `Authorization` header:

```text
Authorization: Bearer YOUR_TOKEN_HERE
```

- `POST /api/students`
- `GET /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

Create student request body:

```json
{
  "name": "Rahul",
  "className": "10",
  "age": 15
}
```

Update student request body:

```json
{
  "name": "Rahul Sharma",
  "className": "10",
  "age": 16
}
```

### Task Routes

These routes are also protected and require the same `Authorization` header.

- `POST /api/task`
- `GET /api/task`
- `PUT /api/task/:id`

Create task request body:

```json
{
  "title": "Math Homework",
  "description": "Complete chapter 3 exercises",
  "student": "STUDENT_ID"
}
```

Mark task route:

```text
PUT /api/task/:id
```

This updates the task status to `done`.

## Postman Testing Flow

1. Register an admin.
2. Login and copy the JWT token.
3. Use the token to create a student.
4. Fetch students and copy a student `_id`.
5. Create a task using that student `_id`.
6. Fetch all tasks.
7. Mark a task as done.

## Notes

- Student routes are mounted at `/api/students`.
- Task routes are currently mounted at `/api/task`.
- Task status values are `pending` and `done`.
- Protected routes require a valid JWT token.

