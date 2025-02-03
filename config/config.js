const env = process.env.NODE_ENV;

const config = {
  sessionSecret: 'SoorAppSecretPassword@(*!@&^#$^%',
  jwtSecret: 'SoorAppSecretPassword@(*!@&^#$^%',
  smsPanelConfig: {
    userApiKey: '645c9f387341f5a53c469f38',
    secretKey: 's55rappPasswordSeCurE',
    templateId: '14247',
    sendingNumber: '50002015705000',
  },
  notifConfig: {
    url: 'https://fcm.googleapis.com/fcm/send',
    key: 'key=AIzaSyC3rvJnH1VkUM_qLNcFBAssV5P2igK9Y6g',
  },
  mongodb: {
    username: 'admindb',
    password: '$MSMONGOp#$4',
  },
  uploadDirectory: './files',
};

if (env === 'test') {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/SoorApp_Test';
  process.env.PORT = 3000;
} else if (env === 'production') {
  if (config.mongodb) {
    process.env.MONGODB_URI = `mongodb://${config.mongodb.username}:${config.mongodb.password}@localhost:27017/SoorApp?authSource=admin`;
  } else {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/SoorApp';
  }
  process.env.PORT = 3000;
} else {
  process.env.NODE_ENV = 'development';
  process.env.PORT = 3000;
  // process.env.MONGODB_URI = `mongodb://${config.mongodb.username}:${config.mongodb.password}@localhost:27017/SoorApp?authSource=admin`;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/SoorApp';
}

module.exports = config;
