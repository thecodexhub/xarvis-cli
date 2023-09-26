const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

const server = app.listen(config.port, () => {
  logger.info(`Server listening to PORT ${config.port}`);
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

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) server.close();
});
