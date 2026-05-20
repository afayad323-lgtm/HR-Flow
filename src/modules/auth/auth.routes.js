const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const protect = require("../../middleware/protect");
const authorizeRoles = require("../../middleware/authorizeRoles");

router.post("/login", authController.login);
router.post(
  "/register",
  protect,
  authorizeRoles("ADMIN", "HR"),
  authController.createUser,
);
router.patch("/change-password", protect, authController.changePassword);

module.exports = router;
