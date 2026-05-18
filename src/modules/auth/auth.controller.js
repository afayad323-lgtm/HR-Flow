const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../users/user.model");
const asyncWrapper = require("../../utils/asyncWrapper");
const AppError = require("../../utils/AppError");

const createUser = asyncWrapper(async (req, res, next) => {
  const { name, email, password, role, department } = req.body;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return next(new AppError("User already exist", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "EMPLOYEE",
    department,
  });
  res.status(201).json({
    message: "user created successfully",
    data: {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
      },
    },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("InValid email or password ", 401));
  }
  if (!user.isActive) {
    return next(new AppError("Account is deactivated", 403));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("InValid email or password", 401));
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" },
  );

  res.status(200).json({
    message: "Login Successful",
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    },
  });
});

const changePassword = asyncWrapper(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 400));
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({
    message: "Password changed successfully",
  });
});

module.exports = {
  login,
  createUser,
  changePassword,
};
