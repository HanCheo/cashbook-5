import express from 'express';
import expressLoader from './express.loaders';
import sequelizeLoader from './sequelize.loaders';

const init = async ({ app }: { app: express.Application }) => {
  await expressLoader({ app });
  await sequelizeLoader();
};

export default { init };
