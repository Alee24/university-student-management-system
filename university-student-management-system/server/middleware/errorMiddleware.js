/**
 * Centralized error handling middleware.  Any errors thrown in async
 * controllers or routes can be passed here via `next(err)` or by
 * throwing inside an async function.  The middleware will send a
 * JSON response with the appropriate status code and message.
 */
function errorHandler(err, req, res, next) {
  console.error(err); // log for debugging
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
}

module.exports = errorHandler;