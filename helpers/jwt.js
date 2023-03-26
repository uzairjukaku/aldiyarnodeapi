var { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;

  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/product(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/category(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/user(.*)/, methods: ["GET", "OPTIONS"] },
      "/user/login",
    ],
  });
}
async function isRevoked(req, payload, done) {
  if (payload.userType != "admin") {
    done(null, true);
  }
  done();
}

module.exports = authJwt;
