const getDateTime = async (req, res, next) => {
  // let result = new Date();
  var result = Math.round((new Date()).getTime() / 1000);
  // var ts = new Date().getTime();
  res.json(result);
};

module.exports = {
  getDateTime,
};
