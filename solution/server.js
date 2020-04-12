const express = require("express");
const verifyUser = require("./middleware/auth");
const handleError = require("./middleware/error");
const user = require("./handlers/users");
const dogs = require("./handlers/dogs");

const PORT = process.env.PORT || 3000;

const server = express();

server.use(express.json());

server.post("/user/signup", user.signup);
server.post("/user/login", user.login);

server.get("/dogs", dogs.getAll);
server.get("/dogs/:id", dogs.get);
server.post("/dogs", verifyUser, dogs.post);
server.put("/dogs/:id", verifyUser, dogs.put);
server.delete("/dogs/:id", verifyUser, dogs.del);

server.use((req, res) => {
  res.status(404).send({ error: "Not found" });
});
server.use(handleError);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
