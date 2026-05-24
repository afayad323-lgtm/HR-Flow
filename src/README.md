🚀 HRFlow

HRFlow is a secure and scalable HR Management System API built with Node.js, Express, and MongoDB.
It handles user management, authentication, and a complete leave approval workflow with role-based access control.

✨ Features
🔐 Authentication & Security
JWT Authentication
Change Password
Secure Password Hashing (bcrypt)
Role-Based Access Control (RBAC)
👥 User Management
User Registration & Login
Get / Update Profile
Admin User Management
Soft Delete Users
Manager Assignment (managerId relationship)
🏖️ Leave Management System
Create Leave Requests
Update / Delete Requests (before approval)
View Leaves based on Role:
Employee → own leaves only
Manager → team leaves
HR/Admin → all leaves
Manager Approval (based on reporting hierarchy)
HR Final Approval
Automatic leave balance deduction
Leave status workflow:
PENDING_MANAGER → PENDING_HR → APPROVED
🧠 Backend Features
Global Error Handling
Async Wrapper Middleware
Clean MVC Architecture
Secure RESTful APIs

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

```bash
src/
│
├── config/
├── middleware/
├── modules/
│   ├── auth/
│   └── users/
├── utils/
└── server.js

## Installation
npm install

## Run The Project
npm run start

## Environment Variables
Create a .env file and add:
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET_KEY=your_secret_key

## API Base URL
http://localhost:5000/api

Author

Ahmed Fayad
