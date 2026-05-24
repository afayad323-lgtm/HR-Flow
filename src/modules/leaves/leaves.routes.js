const express = require("express");
const router = express.Router();
const leavesController = require("./leaves.controller");
const protect = require("../../middleware/protect");
const authorizeRoles = require("../../middleware/authorizeRoles");

router.post("/", protect, leavesController.createLeave);
router.get("/", protect, leavesController.getLeaves);
router.patch("/:id", protect, leavesController.updateLeaves);
router.delete("/:id", protect, leavesController.deleteLeave);
router.patch(
  "/:id/manager-approve",
  protect,
  authorizeRoles("MANAGER"),
  leavesController.managerApproval,
);
router.patch(
  "/:id/hr-approve",
  protect,
  authorizeRoles("HR", "ADMIN"),
  leavesController.hrApproval,
);

router.patch(
  "/:id/manager-reject",
  protect,
  authorizeRoles("MANAGER"),
  leavesController.managerReject,
);
router.patch(
  "/:id/hr-reject",
  protect,
  authorizeRoles("HR", "ADMIN"),
  leavesController.hrReject,
);
module.exports = router;
