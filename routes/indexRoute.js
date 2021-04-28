const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("index");
});

router.get("/createChallenge", (req, res) => {
  res.render("createChallenge");
});


module.exports = router;
