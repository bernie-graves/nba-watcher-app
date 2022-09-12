const express = require("express");
const router = express.Router();

//import controllers
const {
  register,
  login,
  logout,
  getLoggedInUser,
} = require("../controllers/user");

// import middleware
const { userRegisterValidator, userById } = require("../middleware/user");
const { verifyToken } = require("../middleware/auth");

// api routes
router.post("/register", userRegisterValidator, register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/user", verifyToken, userById, getLoggedInUser);

module.exports = router;
