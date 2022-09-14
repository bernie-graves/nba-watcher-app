const express = require("express");
const router = express.Router();

// import controllers
const { getRules, setRules } = require("../controllers/twitter");

//api routes
router.get("/api/rules", getRules);
router.post("/api/rules", setRules);

module.exports = router;
