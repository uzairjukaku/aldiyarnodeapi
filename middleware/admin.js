module.exports = function (req, res, next) {
  if (!req.user.userType == "admin")

  console.log('====================================');
  console.log(req.user.userType);
  console.log('====================================');

    return res.status(403).send("access denied");
  next();
};
