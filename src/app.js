const express = require("express");
const app = express();
const globalErrorHandler = require("./middleware/globalErrorHandler");
const authRoutes = require("./modules/auth/auth.routes.js");
const usersRoutes = require("./modules/users/users.routes.js");
const leavesRoutes = require("./modules/leaves/leaves.routes.js");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/leaves", leavesRoutes);

app.use(globalErrorHandler);

module.exports = app;
