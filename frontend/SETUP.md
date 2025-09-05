# Student Management System Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server
- Angular CLI (`npm install -g @angular/cli`)

## Database Setup

1. Start MySQL server
2. Run the following commands in MySQL:

```sql
-- Create database
CREATE DATABASE student_management;

-- Import the schema
SOURCE C:\Users\hasan\Desktop\StudentManagmentSystem\setup-database.sql;
```

Or use MySQL Workbench to import the `setup-database.sql` file.

## Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Create `.env` file with your database credentials:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_management
JWT_SECRET=your-super-secret-jwt-key-here
```

3. Install dependencies:

```bash
npm install
```

4. Start the backend server:

```bash
npm start
```

The backend will run on http://localhost:3000

## Frontend Setup

1. Navigate to project root:

```bash
cd ..
```

2. Install Angular dependencies:

```bash
npm install
```

3. Start the Angular development server:

```bash
ng serve
```

The frontend will run on http://localhost:4200

## Features

- **Student Registration & Login**: Secure authentication with JWT
- **Dashboard**: View student profile and statistics
- **Complaint Management**: Submit, view, and track complaints
- **Modern UI**: Dark theme with glassmorphism effects
- **Responsive Design**: Works on desktop and mobile

## Default Test User

You can register a new student or create one manually in the database:

```sql
INSERT INTO students (name, email, password, student_id, phone, course, year)
VALUES ('John Doe', 'john@example.com', '$2a$10$encrypted_password', 'STU001', '1234567890', 'Computer Science', 2);
```

## API Endpoints

- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - Student login
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update student profile
- `GET /api/complaints` - Get student complaints
- `POST /api/complaints` - Create new complaint
- `PUT /api/complaints/:id` - Update complaint

## Troubleshooting

1. **Database Connection Error**: Check your MySQL credentials in `.env`
2. **CORS Error**: Make sure backend is running on port 3000
3. **Authentication Error**: Verify JWT secret in `.env`
4. **Module Not Found**: Run `npm install` in both root and backend directories
