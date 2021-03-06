import { Dialect, Sequelize } from 'sequelize';
import mysql2 from 'mysql2'; // Needed to fix sequelize issues with WebPack

import env from '../config';

const params = {
  database: env.SEQUELIZE_DBNAME,
  username: env.SEQUELIZE_DBUSER,
  password: env.SEQUELIZE_DBPASSWORD,
  options: {
    host: env.SEQUELIZE_DBHOST,
    port: env.SEQUELIZE_DBPORT,
    dialect: env.SEQUELIZE_DBDIALECT as Dialect,
    dialectModule: mysql2, // Needed to fix sequelize issues with WebPack
    dialectOptions: {
      decimalNumbers: true, // Decimal Type을 String으로 돌려주는 이슈 해결을 위한 설정
      timezone: '+09:00',
    },
    logging: false,
  },
};

const sequelize = new Sequelize(params.database, params.username, params.password, params.options);
export default sequelize;
