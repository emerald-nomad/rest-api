const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CourseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: [true, "Title is required."]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  estimatedTime: {
    type: String
  },
  materialsNeeded: {
    type: String
  },
  steps: [
    {
      stepNumber: { type: Number },
      title: {
        type: String,
        required: [true, "Title is required."]
      },
      description: {
        type: String,
        required: [true, "Description is required"]
      }
    }
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

module.exports = Course = mongoose.model("Course", CourseSchema, "courses");
