export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Application Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.message
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate field value entered',
      details: err.keyValue
    });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS origin not allowed'
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};

export default {
  notFoundHandler,
  errorHandler
};
