import express from 'express';
import env from './config';
import loaders from './loaders';

async function startServer() {
  const app = express();

  await loaders.init({ app });

  app
    .listen(env.PORT, () => {
      console.log(
        '\x1b[32m%s\x1b[0m',
        `
      #############################################
      🛡️ listening on port: http://localhost:${env.PORT} 🛡️
      #############################################
      `
      );
    })
    .on('error', err => {
      console.error(err);
      process.exit(1);
    });
}

startServer();
