// utils/AppError.js
// A custom error class so we can throw errors with a specific HTTP status code.
// Usage: throw new AppError('Topic is required', 400)

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
