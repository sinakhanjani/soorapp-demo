const profile = require('./routes/api/profile');
const province = require('./routes/api/province');
const city = require('./routes/api/city');
const event = require('./routes/api/event');
const index = require('./routes/web/index');
const login = require('./routes/web/login');
const admin = require('./routes/web/admin');

const article = require('./routes/web/article');
const productCategory = require('./routes/web/productCategory');
const product = require('./routes/web/product');
const productApi = require('./routes/api/product');
const datetimeApi = require('./routes/api/datetime');

const user = require('./routes/web/user');
const contact = require('./routes/web/contact');
const stats = require('./routes/web/stats');
const { web: webErrorHandler, api: apiErrorHandler } = require('./utils/errors/expressHandler');

module.exports = (app) => {
  app.use('/api/profile', profile);
  app.use('/api/province', province);
  app.use('/api/city', city);
  app.use('/api/event', event);
  app.use('/api/product', productApi);
  app.use('/api/datetime', datetimeApi);

  app.use(index);
  app.use('/web', login);
  app.use('/web/users', user);
  app.use('/web/admin', admin);
  app.use('/web/contact', contact);
  app.use('/web/stats', stats);
  app.use('/web/article', article);
  app.use('/web/productCategory', productCategory);
  app.use('/web/product', product);

  // API error handler
  app.use('/api', apiErrorHandler);

  // web error handler
  app.use('/web', webErrorHandler);

  app.use('/web/*', (req, res) => {
    req.flash('warning', 'آدرس مورد نظر وجود ندارد');
    res.redirect('/index');
  });

  app.use('/', (req, res) => {
    res.send('server is running');
  });
};
