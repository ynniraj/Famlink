const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const Authtoken = req.headers.authorization;

  if (!Authtoken) {
    return res.status(500).send("No token, please login");
  }

  const token = Authtoken.split(" ")[1];

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) return res.status(500).send({ err: err, msg: "Token is invalid" });
    req.user = user.id;
    next();
  });
};

module.exports = { verifyToken };
