# Starter project with ES6 + Express + Mongoose + JWT auth
This project aims to be a fast starter for NodeJS REST APIs, offering a pre-configured stack with clean code and simple logic. With this, in a matter of seconds you put an API up and running.
 - [x] ES6 (Babel)
 - [x] Express
 - [x] Mongoose ODM
 - [x] JWT auth (Passport.js)
 - [x] Loads environment variables from .env
 - [x] Nodemon for restarting when code changes
 - [x] ESLint + Prettier + Airbnb styles already set up
 - [x] Morgan for request logs

## Getting started
First, you will need to have a up and running MongoDB server. Then, do as follows:
 1. Clone this repo and cd into it.
 2. Do `yarn` for installing dependencies.
 3. Create a .env file like this:
     ```
     NODE_ENV = dev
     PORT = 3000
     MONGO_URL = mongodb://127.0.0.1:27017/yourdb
     JWT_SECRET = 2eKhpZ6QebcJwde7wgAr0ZJACwckK3UorHZlgCXc1oWowD3JUWKXxtUu4HxE9Er 
    ```
    There is a env_example file that you can just rename and edit.
    Note that MONGO_URL is the MongoDB connection string and JWT_SECRET is a secret for JWT tokens, that you should generate for each API. You can use https://www.grc.com/passwords.htm for generating the secret.
 4. Then, to run, you have these commands:
	 - `yarn dev` to start in dev mode, with auto refresh.
	 - `yarn build` to generate a production optimized version.
	 - `yarn start` to start the production optimized version.

### Authentication
This project includes authentication using Passport.js that relies on Mongoose. To create a user, do a post request to `/auth/register` with params `email` and `password`. Then, a user will be created on database. To sign this user in, do a post request to `/auth/login` with params `email` and `password`, and the response will include a `token`, in JWT format. To authenticate routes, use `passport.authenticate("jwt")` as middleware on the router, like this:
```
router.get("/", passport.authenticate("jwt"), (req, res) => {
  return res.json(req.user);
});
```
or to have optional authentication on a route, use also the anonymous strategy, like this:
```
router.get("/", passport.authenticate(["jwt", "anonymous"]), (req, res) => {
  return res.json(req.user); // returns user if authenticated, or null if not
});
```

### More details
In the project folder, inside `src`, you will find  `controllers` and  `models`. On `controllers` there is a `index.js` file that loads controllers from other files on the same folder, using it at the defined route. On `models` there is a `index.js` file that loads models on the same folder. To create a new model, you create a file on `models` and exports it from `models/index.js`. To create a new controller, you create a file on `controllers` import on `controllers/index.js` and load the route. In both cases, there is a user/auth model/controller that you can use as example.

### Author
- Renan Galeno
### License
MIT