const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const model = require("../model/users");

dotenv.config();
const SECRET = process.env.JWT_SECRET;
const OPTIONS = { expiresIn: "1d" };

function signup(req, res, next) {
  const { email, password, name } = req.body;
  model
    .createUser({ email, password, name })
    .then((user) => {
      const token = jwt.sign({ user: user.id }, SECRET, OPTIONS);
      res.status(201).send({ access_token: token });
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;
  model
    .getUser(email)
    .then((user) => {
      if (password !== user.password) {
        const error = new Error("Unauthenticated");
        error.status = 401;
        next(error);
      } else {
        const token = jwt.sign({ user: user.id }, SECRET, OPTIONS);
        res.status(200).send({ access_token: token });
      }
    })
    .catch(next);
}

module.exports = { signup, login };
