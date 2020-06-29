import bcrypt from "bcrypt-nodejs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

import config from "../config";
import { User } from "../models";

const router = Router();

// Find user by email
const findUser = (email) => {
  return User.findOne({ email })
    .then((user) => {
      if (user)
        throw new Error(
          "There is already an account with this email. Please use a new one."
        );
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

// Login
router.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).json({ message: "Required fields missing." });
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user)
        return res.status(401).json({ message: "User does not exists." });
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
          // Generate JWT token
          const token = jwt.sign({ id: user._id }, config.jwtSecret);
          // Return response
          return res.status(200).json({
            user_id: user._id,
            message: `Welcome.`,
            token,
          });
        }

        return res.status(401).json({ message: "Incorrect password." });
      });
    })
    .catch((err) => {
      return res.status(401).json(err);
    });
});

// Register
router.post("/register", (req, res) => {
  // Require email and password
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Please fill email and password fields." });
  }

  // Check if email is not already used
  findUser(req.body.email)
    .then((_userExistent) => {
      if (_userExistent) {
        res.status(400).json({
          status: 0,
          message:
            "There is already an account with this email. Please use a new one..",
        });
      }
      // Create user and save
      const user = new User({
        email: req.body.email,
        password: req.body.password,
      });
      user
        .save()
        .then(() => {
          res.status(200).json({
            status: 1,
            message: "Welcome!",
            user,
          });
        })
        .catch((err) => {
          res.status(500).json({ status: 0, message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ status: 0, message: err.message });
    });
});

// Get user data
router.get("/", passport.authenticate("jwt"), (req, res) => {
  return res.json(req.user);
});

// Update user data
router.put("/", passport.authenticate("jwt"), (req, res) => {
  User.findById(req.user._id, (err, user) => {
    // Set new data
    if (req.body.password) {
      user.password = req.body.password;
    }
    // Save changes
    user.save();
    // Return response
    return res.json({
      response: {
        status: 1,
        message: "Profile updated.",
      },
      user,
    });
  });
});

export default router;
