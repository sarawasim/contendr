const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const { upload } = require("../middleware/upload");
const { path } = require("path");

const crypto = require("crypto");

const Joi = require("joi");
const { ObjectId } = require("bson");

router.get("/", ensureAuthenticated, (req, res) => {
  // Takes in an arrayOfPosts[] that are associated with the signed in user.
  // Array of posts are passed into the ejs. Creates different divs that
  // contain each post

  // Each post contains urls to each video. display the urls in the ejs page.
  res.render("index");
});

router.get("/createChallenge", ensureAuthenticated, (req, res) => {
  res.render("createChallenge");
});

router.post(
  "/createChallenge",
  ensureAuthenticated,
  upload.single("fileUpload"),
  (req, res) => {
    console.log("testing req.body");
    console.log(req.file.filename);
    let filename = req.file.filename;
    res.render("test", { image: "tempImages/" + filename });
    // need to add form data and upload url into Mongo DB's "posts" collection
  }
);

module.exports = router;
