const User = require("./user.model");
const asyncWrapper = require("../../utils/asyncWrapper");
const AppError = require("../../utils/AppError");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const filter = {
    isActive: true,
  };

  if (req.query.department) {
    filter.department = req.query.department;
  }

  if (req.query.email) {
    filter.email = {
      $regex: req.query.email,
      $options: "i",
    };
  }

  const users = await User.find(filter)
    .select("-password")
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(filter);

  res.status(200).json({
    page,
    limit,
    results: users.length,
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    data: {
      users,
    },
  });
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

const reActivateUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true },
  ).select("-password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res
    .status(200)
    .json({ message: "User activated successfully", data: { user } });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  updateMe,
  deActivateUser,
  adminUpdateUser,
  getMe,
  reActivateUser,
};
