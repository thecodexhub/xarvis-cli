import app from './app';
import config from './config/config';
import logger from './config/logger';

const port: number = config.port;

const server = app.listen(port, () => {
  logger.info(`Server is running on PORT ${port}`);
});

const exitHandler = () => {
  if (server) {
    server.close((err) => {
      logger.info('Server closed');
      process.exit(err ? 1 : 0);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) server.close();
});
