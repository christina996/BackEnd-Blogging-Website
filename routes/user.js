const express = require('express');

const authenticate = require('../middleware/authorization');

const {
  addFollowingUser,
  getFollowingUsersBlogs,
  addNewUser,
  loginUser,
} = require('../controllers/user');
const { getBlogsByUserProfile } = require('../controllers/blog');
const {
  validateUserRegisterRequest,
  validateUserLoginRequest,
  getUserProfile,
} = require('../middleware/user');

const router = express.Router();

router.post('/register', validateUserRegisterRequest, addNewUser);

router.post('/login', validateUserLoginRequest, loginUser);

router.post('/follow-user/:id', authenticate, addFollowingUser);

router.get('/following-blogs', authenticate, getFollowingUsersBlogs);

router.get('/:id', authenticate, getUserProfile, getBlogsByUserProfile);

module.exports = router;
