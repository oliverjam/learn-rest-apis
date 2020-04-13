const express = require("express");
const handleError = require("./middleware/error");

const PORT = process.env.PORT || 3000;

const server = express();

server.use(handleError);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
