const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const dbPath = path.join(__dirname, "db.json");
const initialData = require("./init.json");

// create db.json if it doesn't exist yet
try {
  const dbFileExists = fs.existsSync(dbPath);
  if (!dbFileExists) {
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
} catch (error) {
  console.error("Error creating db.json");
  console.error(error);
}

let db = JSON.parse(fs.readFileSync(dbPath));

function select(key, filterFn) {
  const table = db[key];
  return new Promise((resolve, reject) => {
    if (!table) return reject(new Error(`Table '${key}' not found`));
    if (filterFn) return resolve(table.filter(filterFn));
    return resolve(table);
  });
}

function insert(key, value) {
  const table = db[key];
  if (!table) return Promise.reject(new Error(`Table '${key}' not found`));
  table.push(value);
  return fsPromises.writeFile(dbPath, JSON.stringify(db, null, 2));
}

module.exports = { select, insert };
