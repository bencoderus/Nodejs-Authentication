const fs = require("fs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

var authcontroller = {
  //The protected route
  myinfo: (req, res) => {
    let data = {
      success: true,
      user: req.decoded.user,
    };
    res.json(data);
  },

  register: (req, res) => {
    let data = req.body;
    //Verify if user exists
    user.userExists({ email: data.email }, (err, status) => {
      if (status && !err) {
        res.json({
          success: false,
          message: "Email already exists, login to continue!",
          user: {},
        });
      }
      //Create a new user
      else {
        user.addUser(data, (err, data) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              message: "Registration failed!",
              user: {},
            });
          } else {
            user.setToken(data, (err, token) => {
              if (err) throw err;
              res.json({
                success: true,
                message: "Registration successful!",
                user: data,
                token: token,
              });
            });
          }
        });
      }
    });
  },

  login: (req, res) => {
    let data = req.body;
    user.getUser({ email: data.email }, (err, myuser) => {
      if (!err && myuser) {
        // Load hash from your password DB.
        user.verifyPassword(data.password, myuser.password, (err, status) => {
          if (status && !err) {
            user.setToken(myuser, (err, token) => {
              if (err) throw err;
              res.json({
                success: true,
                message: "Authentication successful!",
                user: myuser,
                token: token,
              });
            });
          } else {
            res.json({
              success: false,
              message: "Authentication failed!",
              user: {},
              token: null,
            });
          }
        });
      } else {
        res.json({
          success: false,
          message: "User was not found",
          user: {},
          token: null,
        });
      }
    });
  },
};

module.exports = authcontroller;
