const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const { upload } = require("../middleware/upload");

const crypto = require("crypto");

const Joi = require("joi");
const { ObjectId } = require("bson");

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("index");
});

router.get("/createChallenge", (req, res) => {
  res.render("createChallenge");
});

// router.post("/createChallenge", upload.single('fileUpload'), (req, res) => {
//   res.send("Success!");
// })

module.exports = router;
