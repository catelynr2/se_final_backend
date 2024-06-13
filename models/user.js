const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

user.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((users) => {
      if (!users) {
        return Promise.reject(new Error("Username or password are incorrect"));
      }

      return bcrypt.compare(password, users.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new Error("Username or password are incorrect")
          );
        }

        return users;
      });
    });
};

module.exports = mongoose.model("User", user);
