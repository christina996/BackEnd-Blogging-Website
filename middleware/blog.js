const { check } = require('express-validator');
const validateRequest = require('./validateRequest');
const CustomError = require('../helpers/customError');

const Blog = require('../models/blog');

const validateBlogRequest = validateRequest([
  check('title').notEmpty().isLength({ min: 3 }),
  check('body').notEmpty().isLength({ min: 20 }),
  check('photo').optional(),
  check('tags').optional(),
]);

const validateUserForBlog = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new CustomError('Blog with the given ID is not exist.', 404);

  if (blog.author !== req.user.id) {
    throw new CustomError('You Are Not Allowed', 403);
  }
  next();
};

module.exports = {
  validateBlogRequest,
  validateUserForBlog,
};
