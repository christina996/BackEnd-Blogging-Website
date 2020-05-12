/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const Blog = require('../models/blog');
const CustomError = require('../helpers/customError');
const upload = require('../middleware/uploadFile');

// will remove in helper
const Paginate = (page, limit, blogs) => {
  const NumOfPages = Math.ceil(blogs.length / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return { blogs: blogs.slice(startIndex, endIndex), NumOfPages };
};
// upload one file
const uploadFile = upload.single('photo');

const addNewBlog = async (req, res) => {
  const { title, body } = req.body;
  let { photo } = req.body;
  let { tags } = req.body;
  if (req.file) photo = `/uploads/${req.file.filename}`;

  if (tags.trim().length === 0) {
    tags = [];
  } else {
    tags = _.uniq(tags.split(',').map((item) => item.trim()));
  }
  const newBlog = new Blog({
    author: req.user._id,
    title,
    body,
    photo,
    tags,
  });
  const blog = await newBlog.save();

  if (!blog) throw new CustomError('Unable to save data', 400);
  res.status(200).json({ message: 'Blog Added Successfully', blog });
};

const deleteBlog = async (req, res) => {
  const deletedBlog = await Blog.findByIdAndRemove(req.params.id);
  if (!deletedBlog) {
    throw new CustomError(
      'Error! The blog with the given ID is not exist',
      422
    );
  }
  res.json({ message: 'Blog Deleted Successfully', id: deletedBlog.id });
};

const updateBlog = async (req, res) => {
  const { title, body, tags } = req.body;
  let { photo } = req.body;
  let tagsArr = [];
  if (tags.trim().length) {
    tagsArr = _.uniq(tags.split(',').map((item) => item.trim()));
  }
  if (req.file) photo = `/uploads/${req.file.filename}`;

  const newData = { title, body, photo, tags: tagsArr };
  await Blog.updateOne({ _id: req.params.id }, newData);
  res.json({
    message: 'Blog Updated Successfully',
    blog: await Blog.findOne({ _id: req.params.id }).populate({
      path: 'author',
      select: 'firstName lastName',
    }),
  });
};

const getBlogsPaginate = async (req, res) => {
  const { page, limit, tag, title, author } = req.query;

  let blogs = await Blog.find({})
    .populate({
      path: 'author',
      select: 'firstName lastName',
    })
    .sort({ createdAt: -1 });

  if (tag) {
    blogs = blogs.filter(
      (blg) => blg.tags.findIndex((tg) => tg.toLowerCase() === tag) !== -1
    );
  } else if (title && title !== '') {
    blogs = blogs.filter((blg) => blg.title.toLowerCase().includes(title));
  } else if (author) {
    blogs = blogs.filter(
      (blg) =>
        blg.author.firstName.toLowerCase().includes(author) ||
        blg.author.lastName.toLowerCase().includes(author)
    );
  }

  const obj = Paginate(page, limit, blogs);

  res.json(obj);
};

const getBlogById = async (req, res) => {
  const blog = await Blog.findById({ _id: req.params.id }).populate({
    path: 'author',
    select: 'firstName lastName',
  });
  if (!blog) throw new CustomError(404, 'Blog Not Found');
  res.json({ blog });
};

const getBlogsByUserProfile = async (req, res) => {
  const { page, limit } = req.query;
  const user = req.userProfile;
  const blogs = await Blog.find({ author: user._id })
    .populate({
      path: 'author',
      select: 'firstName lastName',
    })
    .sort({ createdAt: -1 });
  const obj = Paginate(page, limit, blogs);

  res.json({ user, blogs: obj });
};

const getBlogsById = async (req, res) => {
  const { page, limit } = req.query;

  const blogs = await Blog.find({ author: req.params.id })
    .populate({
      path: 'author',
      select: 'firstName lastName',
    })
    .sort({ createdAt: -1 });
  const obj = Paginate(page, limit, blogs);

  res.json({ blogs: obj });
};

module.exports = {
  addNewBlog,
  deleteBlog,
  updateBlog,
  getBlogsPaginate,
  getBlogById,
  Paginate,
  getBlogsByUserProfile,
  getBlogsById,
  uploadFile,
};
