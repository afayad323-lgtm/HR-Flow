const express = require("express");
const router = express.Router();
const leavesController = require("./leaves.controller");
const protect = require("../../middleware/protect");

router.post("/", protect, leavesController.createLeave);
router.get("/", protect, leavesController.getLeaves);
router.patch("/:id", protect, leavesController.updateLeaves);
router.delete("/:id", protect, leavesController.deleteLeave);
module.exports = router;
