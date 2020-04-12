const { STATUS_CODES } = require("http");

const isProd = process.env.NODE_ENV === "production";

function handleError(error, req, res, next) {
  console.error(error);
  const status = error.status || 500;
  const message = isProd ? STATUS_CODES[status] : error.stack;
  res.status(status).send({ error: message });
}

module.exports = handleError;
