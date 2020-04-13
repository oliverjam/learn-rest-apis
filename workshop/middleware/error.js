const { STATUS_CODES } = require("http");

function handleError(error, req, res, next) {
  console.error(error);
  const status = error.status || 500;
  res.status(status);
  const message = STATUS_CODES[status];
  if (process.env.NODE_ENV === "production") {
    res.send({ error: message });
  } else {
    res.send({ error: message, stack: error.stack });
  }
}

module.exports = handleError;
