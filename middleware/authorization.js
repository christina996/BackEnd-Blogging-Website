const User = require('../models/user');
const CustomError = require('../helpers/customError');

// eslint-disable-next-line consistent-return
const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) {
    return next(new CustomError('Authorization required', 401));
  }
  req.user = await User.getUserFromToken(authorization);
  if (!req.user) return next(new CustomError('Authorization required', 401));
  next();
};

module.exports = authenticate;
