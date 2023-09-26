const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const xss = require('./middlewares/xss');
const ApiError = require('./utils/api-error');
const errorConverter = require('./middlewares/error-converter');
const errorHandler = require('./middlewares/error-handler');
const routes = require('./routes/v1');
const apiRateLimiter = require('./middlewares/rate-limiter');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.succesHandler);
  app.use(morgan.errorHandler);
}

// Set Security HTTP Headers
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// limit repeated failed requests to all the endpoints
// For specific endpoints, use `app.use('/path', apiRateLimiter)`
if (config.env === 'production') {
  app.use(apiRateLimiter);
}

// Routes
app.use('/v1', routes);

// Respond with a 404 for any unknown API request.
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});

// Convert errors, other than ApiError, into ApiError
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

module.exports = app;
