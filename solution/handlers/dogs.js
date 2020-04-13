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
  const id = req.params.id;
  model
    .getDog(id)
    .then((dog) => {
      res.send(dog);
    })
    .catch(next);
}

function post(req, res, next) {
  const newDog = req.body;
  const userId = req.user.id;
  newDog.owner = userId;
  model
    .createDog(newDog)
    .then((dog) => {
      res.status(201).send(dog);
    })
    .catch(next);
}

function put(req, res, next) {
  const dogId = req.params.id;
  const userId = req.user.id;
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
  const dogId = req.params.id;
  const userId = req.user.id;
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
