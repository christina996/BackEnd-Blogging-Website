/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const Blog = require('../models/blog');

const CustomError = require('../helpers/customError');
const Paginate = require('../helpers/Pagination');

const addNewUser = async (req, res) => {
  const newUser = new User(req.body);
  const user = await newUser.save();
  const token = await user.generateToken();
  res
    .status(201)
    .json({ message: `${user.firstName} Register Successfully`, user, token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new CustomError('Wrong username or password', 401);

  const isMatch = await user.checkPassword(password);
  if (isMatch) {
    const token = await user.generateToken();
    res.status(200).json({ user, token });
  } else throw new CustomError('Wrong username or password', 401);
};

const addFollowingUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) throw new CustomError(404, 'User Not Found');
  const found = req.user.following.some((el) => el.toString() === user.id);
  const operator = found ? '$pull' : '$push';
  const message = found ? 'un' : 'you';
  await User.updateOne(
    { _id: req.user._id },
    { [operator]: { following: req.params.id } }
  );
  res.status(200).json({
    message: `${message} follow ${user.firstName} successfully`,
  });
};

const getFollowingUsersBlogs = async (req, res) => {
  const { page, limit } = req.query;
  const blogs = await Blog.find({ author: req.user.following })
    .populate({
      path: 'author',
      select: 'firstName lastName',
    })
    .sort({
      createdAt: -1,
    });
  const obj = Paginate(page, limit, blogs);

  res.json({ blogs: obj });
};

module.exports = {
  addNewUser,
  loginUser,
  addFollowingUser,
  getFollowingUsersBlogs,
};
