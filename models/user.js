const fs = require("fs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const config = require("../config");
var jwt = require("jsonwebtoken");
const privateKey = fs.readFileSync("private.key", "utf8");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = (module.exports = mongoose.model("User", userSchema));

//Add new user and hash password
module.exports.addUser = (data, callback) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(data.password, salt, (err, hash) => {
      data.password = hash;
      let newuser = new User(data);
      newuser.save(callback);
    });
  });
};

//Fetch a single user
module.exports.getUser = (data, callback) => {
  User.findOne(data, callback);
};

//Verify password
module.exports.verifyPassword = (pin, hash, callback) => {
  bcrypt.compare(pin, hash, (err, status) => {
    callback(err, status);
  });
};

//Check if user exists
module.exports.userExists = (data, callback) => {
  User.countDocuments(data, (err, count) => {
    let res = count > 0 ? true : false;
    callback(err, res);
  });
};

//Set JWT token using RSA algorithm
module.exports.setToken = (user, callback) => {
  jwt.sign(
    { user },
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: "100h",
    },
    callback
  );
};
