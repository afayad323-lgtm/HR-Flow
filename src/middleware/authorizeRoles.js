const AppError = require("../utils/AppError");

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to access this route", 403),
      );
    }

    next();
  };
};

module.exports = authorizeRoles;
