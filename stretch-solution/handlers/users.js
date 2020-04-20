const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const model = require("../model/users");

dotenv.config();
const SECRET = process.env.JWT_SECRET;

function get(req, res, next) {
  const id = req.params.id;
  model
    .getUserById(id)
    .then((user) => {
      const response = { id: user.id, name: user.name, email: user.email };
      res.send(response);
    })
    .catch(next);
}

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

function put(req, res, next) {
  const userData = req.body;
  const id = req.params.id;
  const userId = req.user.id;
  if (id !== userId) {
    const error = new Error("Unauthorized");
    error.status = 401;
    next(error);
  } else {
    model
      .updateUser(userId, userData)
      .then((user) => {
        res.status(200).send(user);
      })
      .catch(next);
  }
}

function del(req, res, next) {
  const id = req.params.id;
  const userId = req.user.id;
  if (id !== userId) {
    const error = new Error("Unauthorized");
    error.status = 401;
    next(error);
  } else {
    model
      .deleteUser(userId)
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  }
}

function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  model
    .getUser(email)
    .then((user) => {
      if (password !== user.password) {
        console.log({ email });
        console.log({ password });
        console.log({ userPassword: user.password });
        const error = new Error("Unauthorized");
        error.status = 401;
        next(error);
      } else {
        const token = jwt.sign({ user: user.id }, SECRET, { expiresIn: "1h" });
        res.status(201).send({ access_token: token, id: user.id });
      }
    })
    .catch(next);
}

module.exports = { get, post, put, del, login };
