require('dotenv').config();

const requiredEnvs = [
  'MONGODB_URI',
  'JWT_SECRETKEY',
  'CLOUD_NAME',
  'API_KEY',
  'API_SECRET',
];

const missingEnvs = requiredEnvs.filter((envName) => !process.env[envName]);

if (missingEnvs.length) throw new Error(`Missing required envs ${missingEnvs}`);

module.exports = {
  saltRounds: process.env.SALT_ROUNDS || 7,
  jwtSecretKey: process.env.JWT_SECRETKEY,
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI,
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
};
