import dotenv from 'dotenv';

dotenv.config();

const loadEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`환경변수 ${key}가 정의 되지 않음`);
  }
  return value;
};

export default {
  PORT: Number(loadEnv('PORT')),
  GIT_CLIENT_ID: loadEnv('GIT_CLIENT_ID'),
  GIT_CLIENT_SECRET: loadEnv('GIT_CLIENT_SECRET'),
  JWT_SECRET: loadEnv('JWT_SECRET'),
  JWT_EXPIRESIN: loadEnv('JWT_EXPIRESIN'),
  DEV_CLIENT_URL: loadEnv('DEV_CLIENT_URL'),
  AWS_CLIENT_URL: loadEnv('AWS_CLIENT_URL'),
  SEQUELIZE_DBNAME: loadEnv('SEQUELIZE_DBNAME'),
  SEQUELIZE_DBUSER: loadEnv('SEQUELIZE_DBUSER'),
  SEQUELIZE_DBPASSWORD: loadEnv('SEQUELIZE_DBPASSWORD'),
  SEQUELIZE_DBHOST: loadEnv('SEQUELIZE_DBHOST'),
  SEQUELIZE_DBPORT: Number(loadEnv('SEQUELIZE_DBPORT')),
  SEQUELIZE_DBDIALECT: loadEnv('SEQUELIZE_DBDIALECT'),
};
