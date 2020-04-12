const model = require("../model/dogs");

function getAll(req, res, next) {
  // send a 200 response with all the dogs as the body
}

function get(req, res, next) {
  // send a 200 response with the dog as the body
}

function post(req, res, next) {
  // create a new dog then send a 201 response with the dog as the body
}

function put(req, res, next) {
  // check if the current user owns the dog to delete
  // update the dog then send a 200 response with the updated dog as the body
}

function del(req, res, next) {
  // check if the current user owns the dog to delete
  // delete the dog then send a 204 response with no body
}

module.exports = { getAll, get, post, put, del };
