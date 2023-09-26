const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const ApiError = require('../../src/utils/api-error');
const errorConverter = require('../../src/middlewares/error-converter');

describe('Error converter middleware', () => {
  test('should return the same ApiError object it was called with', () => {
    const error = new ApiError(httpStatus.BAD_REQUEST, 'Bad Request');
    const next = jest.fn();

    errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('should convert an Error to ApiError without changing the statuscode and message', () => {
    const error = new Error('Some error');
    error.statusCode = httpStatus.BAD_REQUEST;

    const next = jest.fn();

    errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: error.message,
        statusCode: error.statusCode,
      }),
    );
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
      }),
    );
  });

  test('should convert an Error without message to ApiError with default message of status code', () => {
    const error = new Error();
    error.statusCode = httpStatus.BAD_REQUEST;

    const next = jest.fn();

    errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: httpStatus[error.statusCode],
        statusCode: error.statusCode,
      }),
    );
  });
});
