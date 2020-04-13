const db = require("../database/db");

function getAllDogs() {
  return db.select("dogs");
}

function getDog(id) {
  const filter = (dog) => dog.id === parseInt(id);
  return db.select("dogs", filter).then((rows) => {
    if (!rows.length) throw new Error(`No dog with id '${id}' found`);
    return rows[0];
  });
}

function createDog(dog) {
  const id = Date.now();
  return db.insert("dogs", { id, ...dog });
}

function updateDog(id, newDog) {
  const filter = (dog) => dog.id === parseInt(id);
  return db.update("dogs", newDog, filter);
}

function deleteDog(id) {
  const filter = (dog) => dog.id !== parseInt(id);
  return db.del("dogs", filter);
}

module.exports = {
  getAllDogs,
  getDog,
  createDog,
  updateDog,
  deleteDog,
};
