import { Dialect, Sequelize } from 'sequelize';
import env from '../config';

const params = {
  database: env.SEQUELIZE_DBNAME,
  username: env.SEQUELIZE_DBUSER,
  password: env.SEQUELIZE_DBPASSWORD,
  options: {
    host: env.SEQUELIZE_DBHOST,
    port: env.SEQUELIZE_DBPORT,
    dialect: env.SEQUELIZE_DBDIALECT as Dialect,
  },
};

const sequelize = new Sequelize(params.database, params.username, params.password, params.options);
export default sequelize;
