import httpStatus from 'http-status';
import * as httpMocks from 'node-mocks-http';
import logger from '../../src/config/logger';
import config from '../../src/config/config';
import { errorHandler } from '../../src/middlewares/error-handler';
import { ApiError } from '../../src/utils/api-error';

describe('Error handler', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'error').mockImplementation(() => logger);
  });

  test('should send proper error response and put the error message in res.locals', () => {
    const error = new ApiError(httpStatus.BAD_REQUEST, 'Some error');
    const res = httpMocks.createResponse();
    const sendSpy = jest.spyOn(res, 'send');

    errorHandler(error, httpMocks.createRequest(), res, () => {});

    expect(sendSpy).toHaveBeenCalledWith(expect.objectContaining({ code: error.statusCode, message: error.message }));
    expect(res.locals.errorMessage).toBe(error.message);
  });

  test('should put the error stack in the response when in development mode', () => {
    const currentEnvValue = config.env;
    config.env = 'development';

    const error = new ApiError(httpStatus.BAD_REQUEST, 'Some error');
    error.stack = 'Some Stack';

    const res = httpMocks.createResponse();
    const sendSpy = jest.spyOn(res, 'send');

    errorHandler(error, httpMocks.createRequest(), res, () => {});

    expect(sendSpy).toHaveBeenCalledWith(
      expect.objectContaining({ code: error.statusCode, message: error.message, stack: error.stack })
    );
    expect(res.locals.errorMessage).toBe(error.message);

    if (currentEnvValue) {
      config.env = currentEnvValue;
    }
  });
});
