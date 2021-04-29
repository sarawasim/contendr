const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
// const { upload } = require("../middleware/upload")
// jojo's multer image upload mess
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './tempImages');
  },
  filename: function (req, file, cb) {
    cb( null, file.originalname);
  }
})

const upload = multer({
  storage: storage,
  limits: {fileSize: 10000000},
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if(extname && mimetype) {
      return cb(null, true)
    } else {
      cb('Error: Images only please!');
    }
  }
})
// end of mess

const crypto = require("crypto");

const Joi = require("joi");
const { ObjectId } = require("bson");

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("index");
});

router.get("/createChallenge", (req, res) => {
  res.render("createChallenge");
});

router.post("/createChallenge", upload.single('fileUpload'), (req, res) => {
  res.send("Success!")
})

module.exports = router;
