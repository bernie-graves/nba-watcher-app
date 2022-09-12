const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  let accessToken = req.cookies.jwt;

  // if no token in the cookies - request is unauthorized
  if (!accessToken) {
    return res.status(403).json({
      error: "Unauthorized",
    });
  }

  let payload;
  try {
    // verify token
    payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    req._id = payload._id;

    next();
  } catch (err) {
    return res.status(403).json({
      error: "Unauthorized",
    });
  }
};
