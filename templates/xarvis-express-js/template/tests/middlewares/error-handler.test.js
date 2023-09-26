const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const logger = require('../../src/config/logger');
const ApiError = require('../../src/utils/api-error');
const errorHandler = require('../../src/middlewares/error-handler');
const config = require('../../src/config/config');

describe('Error handler', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  test('should send proper error response and put the error message in res.locals', () => {
    const error = new ApiError(httpStatus.BAD_REQUEST, 'Some error');
    const res = httpMocks.createResponse();
    const sendSpy = jest.spyOn(res, 'send');

    errorHandler(error, httpMocks.createRequest(), res);

    expect(sendSpy).toHaveBeenCalledWith(expect.objectContaining({ code: error.statusCode, message: error.message }));
    expect(res.locals.errorMessage).toBe(error.message);
  });

  test('should put the error stack in the response when in development mode', () => {
    config.env = 'development';

    const error = new ApiError(httpStatus.BAD_REQUEST, 'Some error');
    const res = httpMocks.createResponse();
    const sendSpy = jest.spyOn(res, 'send');

    errorHandler(error, httpMocks.createRequest(), res);

    expect(sendSpy).toHaveBeenCalledWith(
      expect.objectContaining({ code: error.statusCode, message: error.message, stack: error.stack }),
    );
    expect(res.locals.errorMessage).toBe(error.message);

    config.env = process.env.NODE_ENV;
  });
});
