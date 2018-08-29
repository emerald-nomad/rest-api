const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create Schema
const UserSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Name is required."]
  },
  emailAddress: {
    type: String,
    required: [true, "Email address is required."]
  },
  password: {
    type: String,
    required: [true, "Password is required."]
  }
});

UserSchema.statics.authenticate = function(email, password) {
  return new Promise((resolve, reject) => {
    this.findOne({ emailAddress: email })
      .then(user => {
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            // Create JWT Payload
            const payload = {
              id: user.id,
              fullName: user.fullName,
              emailAddress: user.emailAddress
            };
            // Sign Token
            jwt.sign(
              payload,
              "secretKey",
              { expiresIn: 3600 },
              (err, token) => {
                resolve({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            const error = new Error("Password incorrect");
            reject(error);
          }
        });
      })
      .catch(err => reject(err));
  });
};

UserSchema.pre("save", function(next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) throw err;
      this.password = hash;
      next();
    });
  });
});

module.exports = User = mongoose.model("User", UserSchema, "users");
