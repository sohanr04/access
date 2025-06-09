import { StatusCodes } from 'http-status-codes';

// Custom API error class
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found middleware
export const notFound = (req, res, next) => {
  const error = new ApiError(`Not Found - ${req.originalUrl}`, StatusCodes.NOT_FOUND);
  next(error);
};

// Async handler wrapper
export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    path: req.path,
    method: req.method,
    body: JSON.stringify(req.body).substring(0, 500) + (JSON.stringify(req.body).length > 500 ? '...' : ''),
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  });

  // Handle Joi validation errors
  if (err.name === 'ValidationError') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: true,
      message: err.message,
      details: err.details,
      path: req.path
    });
  }

  // Handle Firebase errors
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      error: true,
      message: err.message,
      code: err.code,
      path: req.path
    });
  }

  // Default error response
  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: true,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    path: req.path
  });
}; 