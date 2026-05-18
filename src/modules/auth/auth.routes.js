const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const protect = require("../../middleware/protect");

router.post("/login", authController.login);
router.post("/register", authController.createUser);
router.patch("/change-password", protect, authController.changePassword);

module.exports = router;
