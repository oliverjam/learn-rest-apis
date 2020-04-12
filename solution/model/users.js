const db = require("../database/db");

function createUser(user) {
  const id = Date.now();
  return db.insert("users", { id, ...user });
}

function getUser(email) {
  const filter = (user) => user.email === email;
  return db.select("users", filter).then((rows) => {
    if (!rows.length) throw new Error(`No user with email '${email}' found`);
    return rows[0];
  });
}

function getUserById(id) {
  const filter = (user) => user.id === id;
  return db.select("users", filter).then((rows) => {
    if (!rows.length) throw new Error(`No user with id '${id}' found`);
    return rows[0];
  });
}

module.exports = {
  createUser,
  getUser,
  getUserById,
};
