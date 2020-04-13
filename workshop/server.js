const express = require("express");
const verifyUser = require("./middleware/auth");
const handleError = require("./middleware/error");
const user = require("./handlers/users");
const dogs = require("./handlers/dogs");

const PORT = process.env.PORT || 3000;

const server = express();

server.use(handleError);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
