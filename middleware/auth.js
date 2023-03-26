const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) res.status(401).send("UnAuthorized access");
  const secret = process.env.secret;

  console.log("====================================");
  console.log(secret);
  console.log("====================================");

  try {
    const decode = jwt.verify(token, secret);
    req.user=decode;
    next();
  } catch (ex) {
    res.status(400).send("Invalid Token data");
  }
}


module.exports=auth;