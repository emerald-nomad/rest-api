const express = require("express");
const router = express.Router();
const passport = require("passport");

const Course = require("../models/Course");
const Review = require("../models/Review");

router.get("/api/courses", (req, res) => {
  Course.find()
    .select("title")
    .then(courses => res.status(200).json(courses))
    .catch(err => console.log(err));
});

router.get("/api/courses/:courseId", (req, res) => {
  Course.findById(req.params.courseId)
    .populate("user")
    .populate("reviews")
    .then(course => {
      res.status(200).json(course);
    });
});

router.post(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    new Course(req.body)
      .save()
      .then(() => {
        res.location("/");
        res.status(201).json();
      })
      .catch(err => res.status(400).json(err));
  }
);

router.put(
  "/api/courses/:courseId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Course.update({ _id: req.params.courseId }, { $set: req.body })
      .then(res.status(204).json())
      .catch(err => res.status(400).json(err));
  }
);

router.post(
  "/api/courses/:courseId/reviews",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    new Review(req.body)
      .save()
      .then(review => {
        Course.update(
          { _id: req.params.courseId },
          { $push: { reviews: review } }
        )
          .then(res.status(200).json())
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
  }
);
module.exports = router;
