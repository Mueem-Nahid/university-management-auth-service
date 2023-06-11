import mongoose from 'mongoose';
import { Server } from 'http';
import app from './app';
import config from './config';
import { logger, errorLogger } from './shared/logger';

process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

let server: Server;

// database connection
async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('Database connection successful !!!');

    server = app.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port} ...`);
    });
  } catch (error) {
    errorLogger.error(`Failed to connect database.`, error);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
