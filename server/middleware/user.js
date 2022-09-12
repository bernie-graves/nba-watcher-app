const user = require("../models/user");

exports.userRegisterValidator = (req, res, next) => {
  // check username not null
  req.check("username", "username is required").notEmpty();

  // check for valid email
  req.check("email", "email is required").notEmpty();
  req.check("email", "Invalid emaail").isEmail();

  // check password
  req
    .check("password")
    .isLength({ min: 8 })
    .withMessage("Password must have at least 8 characters");

  req
    .check(
      "password",
      "Password must contain at least  characters, 1 uppercase, 1 lowercase and 1 number"
    )
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, "i");

  // check for errors
  const errors = req.validationErrors();
  // if error - show first one
  if (errors) {
    const firstError = errors.map((err) => err.msg)[0];

    return res.status(400).json({
      error: firstError,
    });
  }

  // proceed to next middleware
  next();
};

exports.userById = async (req, res, next) => {
  user.findById(req._id).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // add user object in req with all user info
    req.user = user;

    next();
  });
};
