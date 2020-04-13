const express = require("express");
const dogs = require("./handlers/dogs");
const users = require("./handlers/users");
const logger = require("./middleware/logger");
const verifyUser = require("./middleware/auth");
const handleError = require("./middleware/error");

const PORT = process.env.PORT || 3000;

const server = express();

server.use(express.json());
server.use(logger);

server.get("/dogs", dogs.getAll);
server.get("/dogs/:id", dogs.get);
server.post("/dogs/", verifyUser, dogs.post);
server.put("/dogs/:id", verifyUser, dogs.put);
server.delete("/dogs/:id", verifyUser, dogs.del);

server.get("/user/:id", users.post);
server.post("/users", users.post);
server.put("/user/:id", users.put);
server.delete("/user/:id", users.del);

server.use(handleError);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
