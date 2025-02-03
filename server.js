require('./config/config');
require('./config/database');
const app = require('./app');
const { logger } = require('./utils/helpers/Logger');

// const PORT = process.env.PORT || 80;
const { PORT, NODE_ENV: ENV } = process.env;

// running the server
app.listen(PORT, () => {
  logger.info(`server is running on port ${PORT} with environment set to ${ENV}`);
});
