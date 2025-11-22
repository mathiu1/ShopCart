const { stack } = require("../app");
const multer = require("multer");
const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV == "Development") {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  if (process.env.NODE_ENV == "Production") {
    let message = err.message;
    let error = new ErrorHandler(message, 400);

    if (err.name == "ValidationError") {
      message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
      err.statusCode = 400;
    }

    if (err.name == "CastError") {
      message = `Resource not found : ${err.path}`;
      error = new ErrorHandler(message, 400);
      err.statusCode = 400;
    }

    if (err.code == 11000) {
      let message = `Duplicate ${Object.keys(err.keyValue)} error`;
      error = new ErrorHandler(message, 400);
      err.statusCode = 400;
    }

    if (err.name == "JSONWebTokenError") {
      let message = `JSON Web Token is invalid. Try again`;
      error = new ErrorHandler(message, 400);
      err.statusCode = 400;
    }

    if (err.name == "TokenExpiredError") {
      let message = `JSON Web Token is expired. Try again`;
      error = new ErrorHandler(message, 400);
      err.statusCode = 400;
    }

    if (err instanceof multer.MulterError) {
      let message;
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          message = `File too large! Maximum size is 2MB`;
          break;

        default:
          message = `MulterError`;
      }

      error = new ErrorHandler(message, 400);
      err.statusCode = 400;
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || "internal Server Error",
    });
  }
};
