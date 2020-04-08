//Filesystem
const fs = require("fs");
//Jwt
const jwt = require("jsonwebtoken");

//Fetching our private key
var publicKey = fs.readFileSync("public.key", "utf8");
var privateKey = fs.readFileSync("private.key", "utf8");

let checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase

  if (token) {
    //Check if Token sent contains Bearer
    if (token.indexOf("Bearer ") === 0) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    jwt.verify(token, publicKey,  { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Token is not valid",
        });
      } else {
        //success
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Auth token is not supplied",
    });
  }
};

module.exports = {
  verifyToken: checkToken,
};
