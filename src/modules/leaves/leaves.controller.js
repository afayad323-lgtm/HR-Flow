const asyncWrapper = require("../../utils/asyncWrapper");
const AppError = require("../../utils/AppError");
const leavesModels = require("./leaves.models");
const User = require("../users/user.model");
const ApiFeatures = require("../../utils/apiFeatures");

const createLeave = asyncWrapper(async (req, res, next) => {
  const { startDate, endDate, reason } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end - start;

  const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (start > end) {
    return next(new AppError("Start date must be before end date", 400));
  }
  const user = req.user;
  if (numberOfDays > user.availableLeavesDays) {
    return next(new AppError("Insufficient leave balance", 400));
  }
  const leave = await leavesModels.create({
    employee: req.user.id,
    startDate,
    endDate,
    reason,
    numberOfDays,
  });

  res
    .status(201)
    .json({ message: "Leave request submitted successfully", data: { leave } });
});

const getLeaves = asyncWrapper(async (req, res, next) => {
  let filter = {};

  if (req.user.role === "EMPLOYEE") {
    filter.employee = req.user.id;
  }

  if (req.user.role === "MANAGER") {
    const users = await User.find({ managerId: req.user.id }).select("_id");
    filter.employee = users.map((u) => u._id);
  }

  const features = new ApiFeatures(leavesModels.find(filter), req.query)
    .filter()
    .search()
    .sort()
    .paginate();

  const leaves = await features.query.populate(
    "employee",
    "name email department",
  );

  const total = await leavesModels.countDocuments(filter);

  res.status(200).json({
    results: leaves.length,
    total,
    page: req.query.page * 1 || 1,
    totalPages: Math.ceil(total / (req.query.limit || 10)),
    data: { leaves },
  });
});

const updateLeaves = asyncWrapper(async (req, res, next) => {
  const { startDate, endDate, reason } = req.body;

  const leave = await leavesModels.findById(req.params.id);

  if (!leave) {
    return next(new AppError("leave not found", 404));
  }

  if (leave.employee.toString() !== req.user.id) {
    return next(new AppError("You are not authorized", 403));
  }

  if (leave.status !== "PENDING_MANAGER") {
    return next(new AppError("You cannot update processed leave", 400));
  }

  if (startDate) leave.startDate = startDate;
  if (endDate) leave.endDate = endDate;
  if (reason) leave.reason = reason;

  const numberOfDays =
    (new Date(leave.endDate) - new Date(leave.startDate)) /
      (1000 * 60 * 60 * 24) +
    1;

  leave.numberOfDays = numberOfDays;

  await leave.save();

  res.status(200).json({
    message: "leave updated successfully",
    data: { leave },
  });
});

const deleteLeave = asyncWrapper(async (req, res, next) => {
  const leave = await leavesModels.findById(req.params.id);

  if (!leave) {
    return next(new AppError("leave not found", 404));
  }

  if (leave.employee.toString() !== req.user.id) {
    return next(new AppError("You are not authorized", 403));
  }

  if (leave.status !== "PENDING_MANAGER") {
    return next(new AppError("You cannot delete processed leave", 400));
  }

  await leave.deleteOne();

  res.status(200).json({
    message: "leave deleted successfully",
    data: null,
  });
});

const managerApproval = asyncWrapper(async (req, res, next) => {
  const leave = await leavesModels.findById(req.params.id);

  if (!leave) {
    return next(new AppError("leave not found", 404));
  }

  const employee = await User.findById(leave.employee);

  if (!employee.managerId || employee.managerId.toString() !== req.user.id) {
    return next(new AppError("Not your employee", 403));
  }

  if (leave.status !== "PENDING_MANAGER") {
    return next(new AppError("Invalid status", 400));
  }
  if (leave.status === "APPROVED" || leave.status === "REJECTED") {
    return next(new AppError("Leave already processed", 400));
  }

  leave.status = "PENDING_HR";
  leave.approvedBy = req.user.id;

  await leave.save();

  const updatedLeave = await leavesModels
    .findById(leave._id)
    .populate("approvedBy", "name email");
  res.status(200).json({
    message: "Leave approved by manager",
    data: { leave: updatedLeave },
  });
});

const hrApproval = asyncWrapper(async (req, res, next) => {
  const leave = await leavesModels.findById(req.params.id);

  if (!leave) {
    return next(new AppError("leave not found", 404));
  }

  if (leave.status !== "PENDING_HR") {
    return next(new AppError("Invalid status", 400));
  }
  if (leave.status === "APPROVED" || leave.status === "REJECTED") {
    return next(new AppError("Leave already processed", 400));
  }
  const employee = await User.findById(leave.employee);

  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }

  employee.availableLeavesDays -= leave.numberOfDays;

  leave.status = "APPROVED";
  leave.approvedBy = req.user.id;

  await leave.save();
  await employee.save();

  const updatedLeave = await leavesModels
    .findById(leave._id)
    .populate("approvedBy", "name email");

  res.status(200).json({
    message: "Leave approved by HR",
    data: { leave: updatedLeave },
  });
});

const managerReject = asyncWrapper(async (req, res, next) => {
  const leave = await leavesModels.findById(req.params.id);
  if (!leave) {
    return next(new AppError("leave not found", 404));
  }
  const employee = await User.findById(leave.employee);

  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }

  if (!employee.managerId || employee.managerId.toString() !== req.user.id) {
    return next(new AppError("Not your employee", 403));
  }

  if (leave.status !== "PENDING_MANAGER") {
    return next(new AppError("Invalid status", 400));
  }
  if (leave.status === "APPROVED" || leave.status === "REJECTED") {
    return next(new AppError("Leave already processed", 400));
  }

  leave.status = "REJECTED";
  leave.rejectedBy = req.user.id;
  await leave.save();
  const updatedLeave = await leavesModels
    .findById(leave._id)
    .populate("rejectedBy", "name email");
  res.status(200).json({
    message: "Leave rejected by manager",
    data: { leave: updatedLeave },
  });
});

const hrReject = asyncWrapper(async (req, res, next) => {
  const leave = await leavesModels.findById(req.params.id);
  if (!leave) {
    return next(new AppError("leave not found", 404));
  }

  if (leave.status !== "PENDING_HR") {
    return next(new AppError("Invalid status", 400));
  }
  if (leave.status === "APPROVED" || leave.status === "REJECTED") {
    return next(new AppError("Leave already processed", 400));
  }

  const employee = await User.findById(leave.employee);

  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }

  leave.status = "REJECTED";
  leave.rejectedBy = req.user.id;

  await leave.save();

  const updatedLeave = await leavesModels
    .findById(leave._id)
    .populate("rejectedBy", "name email");

  res.status(200).json({
    message: "Leave rejected by HR",
    data: { leave: updatedLeave },
  });
});

module.exports = {
  createLeave,
  getLeaves,
  updateLeaves,
  deleteLeave,
  managerApproval,
  hrApproval,
  managerReject,
  hrReject,
};
