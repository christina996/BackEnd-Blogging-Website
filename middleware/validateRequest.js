const { validationResult } = require('express-validator');
const CustomError = require('../helpers/customError');

// eslint-disable-next-line consistent-return
module.exports = (validatorsArray) => async (req, res, next) => {
  const promises = validatorsArray.map((validator) => validator.run(req));
  await Promise.all(promises);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new CustomError('Validation Error', 422, errors.mapped());
    return next(error);
  }
  next();
};
