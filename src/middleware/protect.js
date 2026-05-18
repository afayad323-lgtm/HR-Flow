const jwt = require("jsonwebtoken");
const User = require("../modules/users/user.model");
const asyncWrapper = require("../utils/asyncWrapper");
const AppError = require("../utils/AppError");

const protect = asyncWrapper(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("User no longer exists", 401));
  }

  if (!user.isActive) {
    return next(new AppError("Account is deactivated", 403));
  }

  req.user = user;
  console.log("TOKEN OK");
  console.log(decoded);
  console.log(user);
  console.log("HEADERS:", req.headers.authorization);

  next();
});

module.exports = protect;
