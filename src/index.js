import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import AnonymousStrategy from "passport-anonymous";

import config from "./config";
import initializeDB from "./db";
import User from "./models";
import MainController from "./controllers";

// Initialize Express
const app = express();

// Configure logs with Morgan
if (config.env === "dev") app.use(morgan("dev"));
if (config.env === "production")
  app.use(morgan(":method :url :response-time ms"));

// CORS - you can set up CORS here for better security
app.use(
  cors({
    exposedHeaders: config.corsHeaders,
  })
);

// Body parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
  bodyParser.json({
    limit: config.bodyLimit,
  })
);

// Initialize DB before start listening
initializeDB(() => {
  // Passport auth strategies
  app.use(passport.initialize({ session: false }));
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        return done(user);
      })
      .catch(done);
  });
  const jwtOptions = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  };
  passport.use(
    "jwt",
    new JwtStrategy(jwtOptions, (jwtPayload, done) => {
      User.findById(jwtPayload.id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    })
  );
  passport.use(new AnonymousStrategy());

  // Initialize main controller
  app.use("/", MainController());

  // Start server
  app.listen(config.port, () => {
    console.log("\x1b[34m[API]", "listening on port", config.port, "\x1b[0m");
  });
});
