const datatablesQuery = require('datatables-query');
const stringify = require('csv-stringify');
const fs = require('fs');
const User = require('../../models/User');
const { errorLogger } = require('../../utils/helpers/Logger');

const getUsersPage = (req, res) => res.render('./users/index');

const getAllUsersCSV = async (req, res, next) => {
  try {
    const users = await User.find().select('firstName lastName mobile').lean();

    stringify(users, {
      header: true,
      columns: ['firstName', 'lastName', 'mobile'],
      record_delimiter: 'windows',
      delimiter: ',',
    }, (csvError, csv) => {
      if (csvError) throw csvError;
      const fileName = `user-data-${Number(new Date())}.csv`;
      const path = `./csv/${fileName}`;
      fs.writeFile(path, `\ufeff${csv}`, { encoding: 'utf8' }, (fsError) => {
        if (fsError) throw fsError;
        res.download(path, fileName, (err) => {
          if (err) next(err);
        });
      });
    });
    // stringify(users, {
    //   header: true,
    //   columns: ['firstName', 'lastName', 'mobile'],
    //   record_delimiter: 'windows',
    //   delimiter: ',',
    // })
    //   .pipe(res);
  } catch (error) {
    next(error);
  }
};

// const getUserCSV = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.userId).select('firstName lastName mobile');
//     const csv = csvGenerator.generateCsv(user);
//     return res.download(csv);
//   } catch (error) {
//     next(error);
//   }
// };

const postUserTable = async (req, res) => {
  const params = req.body;
  const query = datatablesQuery(User);

  query.run(params).then((data) => {
    res.json(data);
  }).catch((err) => {
    errorLogger(err);
    res.status(500).json(err);
  });
};

module.exports = {
  getUsersPage,
  postUserTable,
  getAllUsersCSV,
  // getUserCSV,
};
