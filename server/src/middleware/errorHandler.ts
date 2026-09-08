import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { ApiError } from '../types/api.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: unknown[] | undefined;

  public constructor(statusCode: number, code: string, message: string, details?: unknown[]) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const notFoundHandler: RequestHandler = (_request, response) => {
  const payload: ApiError = {
    success: false,
    error: { code: 'NOT_FOUND', message: 'The requested endpoint was not found.' },
  };
  response.status(404).json(payload);
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const appError = error instanceof AppError ? error : undefined;
  const statusCode = appError?.statusCode ?? 500;
  const payload: ApiError = {
    success: false,
    error: {
      code: appError?.code ?? 'INTERNAL_ERROR',
      message: appError?.message ?? 'Something went wrong. Please try again.',
      ...(appError?.details ? { details: appError.details } : {}),
    },
  };

  response.status(statusCode).json(payload);
};
