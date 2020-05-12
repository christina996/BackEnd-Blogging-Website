const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { port } = require('./config');

// to handle async avoid repeated try and catch
require('express-async-errors');

// connect to database
require('./db/mongoose');

const app = express();

// import routes
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');

// to access resources from another origin because of browser policy
app.use(cors());

// for image
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(morgan(':url :method :date'));

// routes middleWares
app.use('/users', userRouter);
app.use('/blogs', blogRouter);

// error handlers
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  err.statusCode = err.statusCode || 500;
  const handledError = err.statusCode < 500;
  res.status(err.statusCode).json({
    message: handledError ? err.message : 'Internal server error',
    errors: err.errors || {},
  });
  next();
});

app.listen(port, () => console.log(`Example app listening at port ${port}`));
