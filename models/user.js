/* eslint-disable object-shorthand */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const _ = require('lodash');

const jwt = require('jsonwebtoken');
const util = require('util');

const { saltRounds, jwtSecretKey } = require('../config');

const jwtVerify = util.promisify(jwt.verify);
const signJwt = util.promisify(jwt.sign);

const emailRegExp = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const PasswordRegExp = new RegExp(
  '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'You must supply first name!'],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'You must supply last name!'],
    },
    email: {
      required: [true, 'Your Email is required'],
      trim: true,
      unique: true,
      uniqueCaseInsensitive: true,
      type: String,
      validate: {
        validator: function (email) {
          return emailRegExp.test(email);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      required: [true, 'Your password is required'],
      trim: true,
      type: String,
      minlength: 5,
      validate: {
        validator: function (pass) {
          return PasswordRegExp.test(pass);
        },
        message: (props) => `${props.value} is not a valid Password!`,
      },
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { transform: (doc, ret) => _.omit(ret, ['__v', 'password']) },
  }
);

userSchema.plugin(uniqueValidator, {
  message: 'Email is already exist',
  type: 'mongoose-unique-validator',
});

userSchema.methods.generateToken = function () {
  // eslint-disable-next-line no-underscore-dangle
  return signJwt({ _id: this._id }, jwtSecretKey, { expiresIn: '1h' });
};

userSchema.statics.getUserFromToken = async function (token) {
  const { _id } = await jwtVerify(token, jwtSecretKey);
  // eslint-disable-next-line no-return-await
  return await this.findById(_id);
};

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function () {
  const currentDocument = this;
  if (currentDocument.isModified('password')) {
    const salt = await bcrypt.genSalt(+saltRounds);
    currentDocument.password = await bcrypt.hash(
      currentDocument.password,
      salt
    );
  }
});

userSchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'author',
});

const User = mongoose.model('User', userSchema);

module.exports = User;
