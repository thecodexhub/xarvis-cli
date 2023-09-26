import httpStatus from 'http-status';
import * as httpMocks from 'node-mocks-http';
import { ApiError } from '../../src/utils/api-error';
import { errorConverter } from '../../src/middlewares/error-converter';

describe('Error converter middleware', () => {
  test('should return the same ApiError object it was called with', () => {
    const error = new ApiError(httpStatus.BAD_REQUEST, 'Bad Request');
    const next = jest.fn();

    errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('should convert an Error without status code to ApiError with status code 500', () => {
    const error = new Error('Some error');

    const next = jest.fn();

    errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: error.message,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      })
    );
  });

  test('should convert an Error without message to ApiError with message of Internal Server Error', () => {
    const error = new Error();
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    const next = jest.fn();

    errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: httpStatus[statusCode],
        statusCode: statusCode,
      })
    );
  });
});
