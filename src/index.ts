import app from './api/app';
import config from './config';
import { logger } from './utils';

async function startProject() {
  // start app server
  app
    .listen(config.port, () => {
      logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on('error', (err) => {
      logger.error(err);
      process.exit(1);
    });
}

startProject();
