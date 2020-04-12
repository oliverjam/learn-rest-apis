const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const model = require("../model/users");

dotenv.config();
const SECRET = process.env.JWT_SECRET;

function verifyUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const error = new Error("Authorization header required");
    error.status = 400;
    next(error);
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const data = jwt.verify(token, SECRET);
    model
      .getUserById(data.user)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch(next);
  } catch (_error) {
    const error = new Error("Invalid token");
    error.status = 401;
    next(error);
  }
}

module.exports = verifyUser;
