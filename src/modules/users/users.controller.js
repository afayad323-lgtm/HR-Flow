const User = require("./user.model");
const asyncWrapper = require("../../utils/asyncWrapper");
const AppError = require("../../utils/AppError");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await User.find({ isActive: true }).select("-password");

  res.status(200).json({ results: users.length, data: { users } });
});

const getSingleUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ data: { user } });
});

const getMe = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  res.status(200).json({
    data: {
      user,
    },
  });
});

const updateMe = asyncWrapper(async (req, res, next) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res
    .status(200)
    .json({ message: "profile updated successfully", data: { user } });
});

const adminUpdateUser = asyncWrapper(async (req, res, next) => {
  const { department, managerId, role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { department, managerId, role },
    { new: true, runValidators: true },
  ).select("-password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res
    .status(200)
    .json({ message: "user updated successfully", data: { user } });
});

const deActivateUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  );
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    message: "User deactivated successfully",
    data: null,
  });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  updateMe,
  deActivateUser,
  adminUpdateUser,
  getMe,
};
