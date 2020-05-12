const mongoose = require('mongoose');

const { mongoUri } = require('../config');

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to Mongo successfully'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
