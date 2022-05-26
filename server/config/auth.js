const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  console.log(req.headers.authorization);
  console.log(req.body);
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret");
    req.userData = decoded;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Authentification Failed"
    });
  }
};
