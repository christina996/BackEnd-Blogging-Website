require('dotenv').config();

const requiredEnvs = ['MONGODB_URI', 'JWT_SECRETKEY'];

const missingEnvs = requiredEnvs.filter((envName) => !process.env[envName]);

if (missingEnvs.length) throw new Error(`Missing required envs ${missingEnvs}`);

module.exports = {
  saltRounds: process.env.SALT_ROUNDS || 7,
  jwtSecretKey: process.env.JWT_SECRETKEY,
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI,
};
