const express = require("express");
const router = express.Router();
// const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

router.get("/", (req, res) => {
  res.send("welcome");
});

module.exports = router;
