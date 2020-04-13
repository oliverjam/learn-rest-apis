# Learn REST APIs

Learn how to build a service that manages JSON data using the REST architecture. We'll also learn how to use bearer tokens to authenticate our API and Postman to test it in development.

## Representational State Transfer (REST)

REST is a set of recommendations for how to structure services that communicate over HTTP. It's not an official standard or specification, but it is designed to fit the HTTP protocol.

For example you access data via HTTP methods and paths. A request like `GET /api/todos` would return a list of all the todos. `DELETE /api/todos/1` would delete the todo with ID 1. The path represents a "resource".

Resources are an important HTTP/REST concept. A URL is a "uniform resource locator"—`http://example.com/api/todos` tells you/the client where the `/api/todos` resource is located. The HTTP method is how the client tells the server what action it wishes to take on the resource (e.g. retrieving it, updating it, deleting it etc).

A resource can be a real file (e.g. `todos.json`) or it can be generated on the fly by a dynamic server pulling the todo data from a database. REST is designed so the client doesn't have to be aware of how the data is stored.

## CRUD

REST APIs usually implement four types of data access: create, read, update & delete. These can be represented by both HTTP methods and SQL commands:

| Operation | HTTP     | SQL      |
| --------- | -------- | -------- |
| Create    | `POST`   | `INSERT` |
| Read      | `GET`    | `SELECT` |
| Update    | `PUT`    | `UPDATE` |
| Delete    | `DELETE` | `DELETE` |

This means for any given resource you're likely to have 4 routes: `POST /resource`, `GET /resource/:id`, `PUT /resource/:id` and `DELETE /resource/:id`. REST APIs often have a way to list all instances of a resource with `GET /resource` (without an identifier).

## Setup

1. Clone this repo
1. Run `npm install`
1. Run `npm run dev`

The `workshop/` directory contains a fake database that writes to `workshop/database/db.json`. It also contains a `workshop/model/` directory that manages the data access. These are written for you so you can focus on the Express handlers and middleware.

You're going to build a REST API for a database of dogs. There are two "tables" in the "database": "users" and "dogs". Each dog has an "owner" property that is a user ID. Each user can own many dogs. You can see the data the database starts with in `workshop/database/init.json`.

## JSON data

Up until now our servers have mostly been responding with HTML. Since this server is designed to be a general purpose API (that could be consumed by a web app, mobile app etc) it's best if we respond with data in a useful generic format. JSON is usually the format of choice for modern APIs. Luckily Express handles JSON responses for us, so we can keep using `res.send` to send response bodies.

## Reading resources

We'll start with reading data so we can get our server returning something. Create a `workshop/handlers/dogs.js` file and import the dogs model from `../model/dogs`.

This file is where all the handlers for our dogs resources will live. Create a `getAll` handler function and export it. This handler should use `model.getAllDogs` to retrieve all the dogs in the database, then send them as the response body using `res.send`.

All the `model` functions return promises, so you'll need to use `.then` and `.catch` with them. If the handler catches an error it should call the `next` argument with that error to let Express handle it.

<details>
<summary>Solution</summary>

```js
const model = require("../model/dogs");

function getAll(req, res, next) {
  model
    .getAllDogs()
    .then((dogs) => {
      res.send(dogs);
    })
    .catch(next);
}
```

</details>

Create a `GET /dogs` route in `workshop/server.js` that uses the `dogs.getAll` handler. Visit http://localhost:3000/dogs in your browser and you should see an array containing a single dog object.

<details>
<summary>Solution</summary>

```js
const dogs = require("./handlers/dogs");

server.get("/dogs", dogs.getAll);
```

</details>

Now we need to do the same for the `GET /dogs/:id` route. Create a handler named `get` that uses `model.getDog(id)` to retrieve a single dog from the database. Add this route to your server, then visit http://localhost:3000/dogs/1586691897927 and you should see a single dog object.

Remember you can access route params (placeholder values) on the `req.params` object.

<details>
<summary>Solution</summary>

```js
function get(req, res, next) {
  const id = req.params.id;
  model
    .getDog(id)
    .then((dog) => {
      res.send(dog);
    })
    .catch(next);
}
```

```js
server.get("/dogs/:id", dogs.get);
```

</details>

## Postman

A web browser is not a great tool for developing JSON APIs. Chrome especially has no built-in JSON formatting, making it a bit awkward. It's also annoying to send anything but a `GET` request.

Instead we'll be using [Postman](https://www.postman.com/) to test our server. This is a nice tool for sending any type of HTTP request. Open Postman and create a new request. Choose `GET` for the method and `localhost:3000/dogs/` as the request URL. Click "Send" and you should see the JSON response appear below.

![Using Postman to make a GET request](https://user-images.githubusercontent.com/9408641/79138741-f1098000-7dac-11ea-8432-10772dc80666.png)

## Creating resources

Now we need to add a route for adding new dogs to the database. Since this is a JSON API we need to be able to _receive_ JSON data. For example until now we've had data submitted via HTML forms, which means the `POST` bodies had a `content-type` of `x-www-form-urlencoded`. Now we'll be receiving bodies formatted as `application/json`.

Luckily Express has built-in support for JSON bodies, just like urlencoded ones. Add the `express.json` middleware to your server in `workshop/server.js`.

<details>
<summary>Solution</summary>

```js
server.use(express.json());
```

</details>

Create a handler function named `post` that gets the submitted data from `req.body`, then uses `model.createDog` to add a dog to the database. Once the dog is created respond with a `201` status code and the new dog object. `201` means "new resource created". Make sure you respond with the object that `createDog` resolves with (rather than the user-submitted one) since it will contain the database-generated ID.

Add this handler to your server for the `POST /dogs/:id` route.

We can test this endpoint using Postman. Create a new request and change the method to POST. Keep the URL as `localhost:3000/dogs`. Go to the "Body" tab, then select the "raw" radio button. This will let us send a JSON POST body. Change the format dropdown from "Text" to "JSON", then enter this data in the textarea:

```json
{
  "name": "Pongo",
  "breed": "Dalmation",
  "owner": 1586691863221
}
```

For now we're hardcoding the owner, as we haven't implemented authentication yet. Submit this request and you should see a `201` response with a body like this:

```json
{
  "id": 1586716616202,
  "name": "Pongo",
  "breed": "Dalmation",
  "owner": 1586691863221
}
```

<details>
<summary>Solution</summary>

```js
function post(req, res, next) {
  const newDog = req.body;
  model
    .createDog(newDog)
    .then((dog) => {
      res.status(201).send(dog);
    })
    .catch(next);
}
```

```js
server.post("/dogs", dogs.post);
```

</details>

![Sucessful POST request in Postman](https://user-images.githubusercontent.com/9408641/79139054-8442b580-7dad-11ea-9abe-7e299d0be706.png)

## Updating resources

We also need a route for updating dogs. Create a new route for `PUT /dogs/:id`. Write a new handler called `put` that gets a submitted dog object from `req.body`. It should use this new dog object to update the database with `model.updateDog(id, newDog)`. Once this is done respond with a `200` status code and the updated dog object.

<details>
<summary>Solution</summary>

```js
function put(req, res, next) {
  const dogId = req.params.id;
  const newDog = req.body;
  model
    .getDog(dogId)
    .then((dog) => {
      model.updateDog(dogId, newDog).then((dog) => {
        res.status(200).send(dog);
      });
    })
    .catch(next);
}
```

</details>

You can test this using Postman as above. You just need to include the ID of the dog you want to update in the URL.

![Successful PUT request in Postman](https://user-images.githubusercontent.com/9408641/79138987-65dcba00-7dad-11ea-8e00-52be8fca2d2a.png)

## Deleting resources

Finally we need a route for deleting dogs from the database. Create a new route for `DELETE /dogs/:id`. Write a new handler called `del` (`delete` is a reserved word in JS so we can't use that). It should use the ID route param to delete the dog from the database with `model.deleteDog`. Once this is done respond with a `204` ("no content") status code and an empty body. There's nothing to return from a delete (other than indicating the operation was successful).

<details>
<summary>Solution</summary>

```js
function del(req, res, next) {
  const dogId = req.params.id;
  model
    .deleteDog(dogId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}
```

</details>

Test this using Postman to send a `DELETE` request with the ID of the dog you want to delete in the URL. You should see a `204` response with no body.

![Successful delete response in Postman](https://user-images.githubusercontent.com/9408641/79139183-beac5280-7dad-11ea-91f0-c87cecda3086.png)

## Authentication

Our API is currently totally unprotected. This means anyone can add a dog with any owner, and update or delete any dog. For most general APIs only the `GET` routes should be public: anyone can see a list of the dogs, but only the dog's owner should be able to change or remove them.

First we need a way for users to sign up. Our API should treat users like any other resource—ideally we should have routes for creating, reading, updating and deleting them. In the interests of time we'll just implement creation right now.

### User resource creation

Create a new file at `workshop/handlers/users.js`. Inside create a function called `post` that gets the submitted user data from `req.body`. It should use this data to create a new user with `model.createUser`. Once created respond with a `201` status code and the newly created user object.

**Note**: in a real API we'd want to verify that the user's email was unique, since we'll be using this to verify users.

Add a new `POST /users` route to your server that uses the `users.post` handler.

<details>
<summary>Solution</summary>

```js
function signup(req, res, next) {
  const userData = req.body;
  model
    .createUser(userData)
    .then((user) => {
      res.status(201).send(userData);
    })
    .catch(next);
}
```

</details>

Test this using Postman by sending a `POST` request to `localhost:3000/users` with a body like:

```json
{
  "email": "oli@example.com",
  "password": "123",
  "name": "oli"
}
```

You should see a `201` response with the new user object as the body.

### Token-based authentication

We can create a user, but we have no way for subsequent requests to prove they havee been made by that user. We can do this using a token—when a user signs up we can provide a token containing their ID that they must send on all subsequent requests.

We'll use JWTs as our tokens. We need a secret to sign our JWTs with so we can verify they haven't been tampered with. We should keep this secret, well, secret, otherwise anyone can sign our tokens and we can't trust any of them.

Add a `.env` file to the root of the project with a `JWT_SECRET` environment variable. This needs to be a long random string.

```sh
JWT_SECRET=mn6Ak%8fbaf$ur2u£uka*8ava
```

Now we can use `dotenv` to access this on `process.env.JWT_SECRET` in our `workshop/handlers/users` file. Use the secret to sign a JWT containing the newly created user's ID. We need to send the JWT as part of the response object, so add an `access_token` to the object we're sending.

<details>
<summary>Solution</summary>

```js
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

function signup(req, res, next) {
  const userData = req.body;
  model
    .createUser(userData)
    .then((user) => {
      const token = jwt.sign({ user: user.id }, SECRET, { expiresIn: "1h" });
      user.access_token = token;
      res.status(201).send(user);
    })
    .catch(next);
}
```

</details>

### Logging in

Our token currently expires after one hour. Users can't keep creating new accounts to get new tokens, so we need to add a route allowing them to log in and get a new token.

Create a handler named `login` that gets the submitted email and password from `req.body`. It should then use `model.getUser(email)` to find the user in the database and compare the submitted password to the stored one.

**Note**: our passwords are in plaintext here. This is **bad** so never do it in a real app. Implementing hashing here would distract from the goal of this workshop.

If the passwords do not match then create a new error with a message of "Unauthorized". Set a `status` property on the error object with a value of `401`. Then call `next` with the error to pass it on to the error-handling middleware.

If the passwords match then sign a new JWT using `process.env.JWT_SECRET` and respond with a `200` and an object with just the `access_token` property.

<details>
<summary>Solution</summary>

```js
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

function login(req, res, next) {
  const { email, password } = req.body;
  model
    .getUser(email)
    .then((user) => {
      if (password !== user.password) {
        const error = new Error("Unauthorized");
        error.status = 401;
        next(error);
      } else {
        const token = jwt.sign({ user: user.id }, SECRET, { expiresIn: "1h" });
        res.status(200).send({ access_token: token });
      }
    })
    .catch(next);
}
```

</details>

### Verifying tokens

Our API is going to use something called "bearer tokens" for authentication. This means any request for a protected resource must have an `authorization` header with a value like this `Bearer 12345` (where `12345` is a valid token). Let's create a middleware that can grab this token, extract the user, then put it on the request object for subsequent handlers to use.

Create a new file `workshop/middleware/auth.js`. Write a middleware function named `verifyUser`. It should read `req.headers.authorization` to get the token. If the header isn't present create a new error with a status property of `400` ("bad request"). Call `next` with the error to pass it to the error-handling middleware.

To get the token out of the header you'll need to remove the "Bearer" bit:

```js
const token = authHeader.replace("Bearer ", "");
```

Once you have this use the JWT library to verify the token and get the decoded user object. We want to grab the matching user from the database, then attach it to the request object. That way all our other handlers will be able to access the authenticated user. You can use `model.getUserById` to get the user from the database. Don't forget to call `next()` when you're done to pass the request on to the next handler.

If the JWT verification fails you should create an error with a status property of `401` and all `next` with it.

<details>
<summary>Solution</summary>

```js
function verifyUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const error = new Error("Authorization header required");
    error.status = 400;
    next(error);
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const data = jwt.verify(token, SECRET);
    model
      .getUserById(data.user)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch(next);
  } catch (_error) {
    const error = new Error("Invalid token");
    error.status = 401;
    next(error);
  }
}
```

</details>

### Protecting routes

Now that we have users and tokens working we can protect the routes that should be private. Add the `verifyUser` middleware before the `POST /dogs`, `PUT /dogs/:id` and `DELETE /dogs/:id` route handlers. Now requests with no token (or an invalid token) will be rejected before reaching our handlers.

<details>
<summary>Solution</summary>

```js
server.post("/dogs", verifyUser, dogs.post);
server.put("/dogs/:id", verifyUser, dogs.put);
server.delete("/dogs/:id", verifyUser, dogs.del);
```

</details>

Test this in Postman by trying to delete a dog without sending an `authorization` header. You should receive a `400` error.

Now add a random invalid `authorization` header. Postman has two ways to do this. You can go to the "Authorization" tab, select "Bearer Token" from the "Type" dropdown, then set the token as "1234".

![Letting Postman set the auth header](https://user-images.githubusercontent.com/9408641/79138459-72144780-7dac-11ea-84c6-cc4d38eb56da.png)

Or you can manually set the header in the "Headers" tab (with a key of "authorization" and a value of "Bearer 1234"). You should receive a `401` error.

![Manually adding auth headers in Postman](https://user-images.githubusercontent.com/9408641/79138399-5b6df080-7dac-11ea-9665-0512e9671ed1.png)

Finally log in as a real user, then send their `access_token` as the `authorization` header. The dog should be created successfully.

#### Checking a dog's owner

However this isn't quite enough. Currently _any_ logged in user can delete any dog, since we're just checking for a valid token. We need to amend our `PUT` and `DELETE` handlers to get the authenticated user's ID from `req.user`, then check if that ID matches the dog's `owner` property. If it does not create a new error with a `401` status property and call `next` with it.

<details>
<summary>Solution</summary>

```js
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

// del is the same
```

</details>

Test this is Postman by creating a new user, then trying to delete another user's dog sending the new user's token in the `authorization` header. You should get a `401` response. Then log in as the dog's owner and try with their token. This time the dog should be deleted successfully.

#### Setting a new dog's owner

The final step is to amend our `POST` handler. Currently it allows the dog's owner to be set to any user ID. We should instead take the user ID from `req.user` to ensure that a dog's owner is always the currently authenticated user.

<details>
<summary>Solution</summary>

```js
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
```

</details>

Test this is Postman by sending a `POST` request with a new dog object. Make sure you have a valid `authorization` header set. Don't send an `owner` property. The response should contain an `owner` property with the ID of the logged in user.

## Stretch goals

Add the missing CRUD routes for `/user` (`GET`, `PUT` and `DELETE`). Make sure only authenticated users can access these, and that users can only edit or delete themselves.
