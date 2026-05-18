const express = require("express");
const router = express.Router();
const userController = require("./users.controller");
const protect = require("../../middleware/protect");
const authorizeRoles = require("../../middleware/authorizeRoles");

router.get(
  "/",
  protect,
  authorizeRoles("HR", "ADMIN"),
  userController.getAllUsers,
);

router.get("/me", protect, userController.getMe);

router.get(
  "/:id",
  protect,
  authorizeRoles("HR", "ADMIN"),
  userController.getSingleUser,
);

router.patch("/me", protect, userController.updateMe);

router.patch(
  "/:id",
  protect,
  authorizeRoles("HR", "ADMIN"),
  userController.adminUpdateUser,
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("HR", "ADMIN"),
  userController.deActivateUser,
);

module.exports = router;
