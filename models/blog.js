const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: [true, 'UserID is required'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Blog title is required'],
      minlength: 3,
    },
    body: {
      type: String,
      trim: true,
      required: [true, 'Blog Body is required'],
      minlength: 20,
    },
    photo: {
      type: String,
      required: [true, 'Blog Image is required'],
    },
    tags: {
      type: [String],
    },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', tags: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
