const model = require("../model/dogs");

function getAll(req, res, next) {
  model
    .getAllDogs()
    .then((dogs) => {
      res.send(dogs);
    })
    .catch(next);
}

function get(req, res, next) {
  const { id } = req.params;
  model
    .getDog(id)
    .then((dog) => {
      res.send(dog);
    })
    .catch(next);
}

function post(req, res, next) {
  const user = req.user;
  const dog = req.body;
  dog.owner = user.id;
  model
    .createDog(dog)
    .then((dog) => {
      res.status(201).send(dog);
    })
    .catch(next);
}

function put(req, res, next) {
  const userId = req.user.id;
  const dogId = req.params.id;
  const newDog = req.body;
  model
    .getDog(dogId)
    .then((dog) => {
      if (dog.owner !== userId) {
        const error = new Error("Unauthorized");
        error.status = 401;
        next(error);
      } else {
        model.updateDog(dogId, newDog).then((dog) => {
          res.status(200).send(dog);
        });
      }
    })
    .catch(next);
}

function del(req, res, next) {
  const userId = req.user.id;
  const dogId = req.params.id;
  model
    .getDog(dogId)
    .then((dog) => {
      if (dog.owner !== userId) {
        const error = new Error("Unauthorized");
        error.status = 401;
        next(error);
      } else {
        model.deleteDog(dogId).then(() => {
          res.status(204).send();
        });
      }
    })
    .catch(next);
}

module.exports = { getAll, get, post, put, del };
