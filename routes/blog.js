const express = require('express');

const {
  validateBlogRequest,
  validateUserForBlog,
} = require('../middleware/blog');
const authenticate = require('../middleware/authorization');
const {
  addNewBlog,
  deleteBlog,
  updateBlog,
  getBlogsPaginate,
  getBlogById,
  getBlogsById,
  uploadFile,
} = require('../controllers/blog');

const router = express.Router();
router.get('/user/:id', authenticate, getBlogsById);

router.get('/', getBlogsPaginate);

router.delete('/:id', authenticate, validateUserForBlog, deleteBlog);

router.patch('/:id', authenticate, uploadFile, validateUserForBlog, updateBlog);

router.get('/search', authenticate, getBlogsPaginate);

router.get('/:id', getBlogById);

router.post('/', authenticate, uploadFile, validateBlogRequest, addNewBlog);

module.exports = router;
