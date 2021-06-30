import { ErrorRequestHandler } from 'express';
import config from '../../config';
import { logger } from '../../utils';

export const defaultErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  logger.error(error);

  res.statusCode = statusCode;

  if (!config.isProduction) {
    return res.json({
      success: false,
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }

  return res.status(statusCode).send({
    success: false,
    error: {
      message: 'Something went wrong',
    },
  });
};
