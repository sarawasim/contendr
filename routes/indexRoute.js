const express = require("express");
const router = express.Router();
// const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/createChallenge", (req, res) => {
  res.render("createChallenge");
});

module.exports = router;
