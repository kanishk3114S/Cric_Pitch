// middleware/errorHandler.js
// One place to catch ALL errors from any route — keeps controllers clean.

export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Something went wrong on the server.',
  });
};
