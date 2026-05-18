const express = require("express");
const app = express();
const globalErrorHandler = require("./middleware/globalErrorHandler");
const authRoutes = require("./modules/auth/auth.routes.js");
const usersRoutes = require("./modules/users/users.routes.js");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use(globalErrorHandler);

module.exports = app;
