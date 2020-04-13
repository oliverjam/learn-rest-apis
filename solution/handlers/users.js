const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const model = require("../model/users");

dotenv.config();
const SECRET = process.env.JWT_SECRET;

function post(req, res, next) {
  const userData = req.body;
  model
    .createUser(userData)
    .then((user) => {
      const token = jwt.sign({ user: user.id }, SECRET, { expiresIn: "1h" });
      user.access_token = token;
      res.status(201).send(user);
    })
    .catch(next);
}

function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  model
    .getUser(email)
    .then((user) => {
      if (password !== user.password) {
        const error = new Error("Unauthorized");
        error.status = 401;
        next(error);
      } else {
        const token = jwt.sign({ user: user.id }, SECRET, { expiresIn: "1h" });
        res.status(201).send({ access_token: token });
      }
    })
    .catch(next);
}

module.exports = { post, login };
