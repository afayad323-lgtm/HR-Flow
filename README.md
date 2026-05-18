# HRFlow

HRFlow is a secure HR management system API built with Node.js, Express, and MongoDB.

## Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- User Registration & Login
- Change Password
- Get Current User Profile
- Update User Profile
- Admin User Management
- Soft Delete Users
- Global Error Handling
- Async Wrapper Middleware
- Secure RESTful APIs

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
