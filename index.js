/*
 * Name: Patricia Interview
 * Description: Authentication based system using RSA Algorithm.
 * Author: Benjamin Iduwe
 * Date: 07/04/2020
 * Technologies: Nodejs, Express and Mongodb
 */

//Express js setup for routing
const express = require("express");
const app = express();
const config = require("./config");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const port = 3000;

//Use Body parser and Cors
app.use(bodyParser.json());
app.use(cors());

//Express routing
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api", apiRoutes);

//Connect to Database
mongoose
  .connect(config.dbconnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((data) => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
