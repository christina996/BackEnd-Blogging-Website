const { check } = require('express-validator');
const validateRequest = require('./validateRequest');

const User = require('../models/user');
const CustomError = require('../helpers/customError');

const checkUserEmailAndPassword = [
  check('email').isEmail().notEmpty(),
  check('password').isLength({ min: 5 }),
];

const validateUserLoginRequest = validateRequest(checkUserEmailAndPassword);

const validateUserRegisterRequest = validateRequest([
  ...checkUserEmailAndPassword,
  check('firstName').notEmpty(),
  check('lastName').notEmpty(),
]);

const getUserProfile = async (req, res, next) => {
  const user = await User.findById({ _id: req.params.id });
  if (!user) throw new CustomError(404, 'User Not Found');
  req.userProfile = user;
  next();
};

module.exports = {
  validateUserLoginRequest,
  validateUserRegisterRequest,
  getUserProfile,
};
