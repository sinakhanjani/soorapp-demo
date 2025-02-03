const fs = require('fs');
const logger = require('../utils/helpers/Logger');

let retryCount = 0;
const createUploadDirectory = async (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdir(path, (err) => {
      if (err) {
        logger.error(err);
        retryCount += 1;
        if (retryCount > 2) throw new Error('Upload directory did not succeed');
        createUploadDirectory(path);
      }
    });
  }
};

module.exports = createUploadDirectory;
