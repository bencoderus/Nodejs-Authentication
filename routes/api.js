const express = require("express");
const route = express.Router();
const authcontroller = require("../controllers/auth");
const middleware = require("../routes/middleware");

route.post("/myinfo", middleware.verifyToken, authcontroller.myinfo);
route.post("/register", authcontroller.register);
route.post("/login", authcontroller.login);
module.exports = route;
