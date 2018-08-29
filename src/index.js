"use strict";

// load modules
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");

const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");

const app = express();

mongoose.connect(
  "mongodb://localhost:27017/course-api",
  { useNewUrlParser: true }
);

const db = mongoose.connection;

db.on("error", function(err) {
  console.error("Connection error:", err);
});

db.once("open", function() {
  console.log("DB connection successful!");
});
// set our port
app.set("port", process.env.PORT || 5000);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport.js")(passport);

// TODO add additional routes here
app.use("/", userRoutes);
app.use("/", courseRoutes);

// send a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Course Review API"
  });
});

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
