const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User");

router.post("/api/users/login", (req, res) => {
  User.authenticate(req.body.email, req.body.password)
    .then(token => res.status(200).json(token))
    .catch(err => res.status(400).json(err));
});

router.get(
  "/api/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

router.post("/api/users", (req, res) => {
  new User(req.body)
    .save()
    .then(() => {
      res.location("/");
      res.status(201).json();
    })
    .catch(err => res.status(400).json(err));
});
module.exports = router;
