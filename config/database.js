const mongoose = require('mongoose');
const { errorLogger } = require('../utils/helpers/Logger');

// resolve mongoose deprecation warnings
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

// database connection
mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (err) errorLogger(err);
});

mongoose.connection.on('connected', async () => {
  // for creating an initial user to log in dashboard (since registration is not implemented)
  // uncomment if needed
  const Admin = require('../models/Admin');
  Admin.register(new Admin({
    fullName: 'نام مدیر',
    email: 'a@g.com',
    isManager: true,
  }), '1', (error) => {
    if (error) return errorLogger(error.message);
  });
});
