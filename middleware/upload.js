const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './test');
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

module.exports = upload;


