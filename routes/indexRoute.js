const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
<<<<<<< HEAD
// const { upload } = require("../middleware/upload")
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
=======
const crypto = require("crypto");

const Joi = require("joi");
const { ObjectId } = require("bson");
>>>>>>> 4619879258b980b9c32a365d03bf380089e7276f

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("index");
});

router.get("/createChallenge", (req, res) => {
  res.render("createChallenge");
});

<<<<<<< HEAD
router.post("/createChallenge", upload.single('fileUpload'), (req, res) => {
  res.send("Success!")
})
=======
router.post("/createChallenge", (req, res) => {
  console.log(req.body);
});
>>>>>>> 4619879258b980b9c32a365d03bf380089e7276f

module.exports = router;
