const multer = require('multer');
const fs = require('fs');
const utils = require('../utils');
const { uploadDirectory } = require('../../config/config');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const path = `${uploadDirectory}/`;
    // directory existence check and creation
    cb(null, path);
  },

  filename(req, file, cb) {
    file.ext = (file.originalname).split('.').pop();
    file.dateString = utils.getNowInString();
    file.randomData = utils.generateAuthCode(); // for making file names unique
    cb(null, `${file.dateString}-${file.fieldname}-${file.randomData}.${file.ext}`);
  },
});

module.exports = multer({ storage });
