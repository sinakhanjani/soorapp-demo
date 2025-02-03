const mongoose = require('mongoose');
const Article = require('../../models/Article');
const articleDB = require('../staticData/articles');

mongoose.connection.on('connected', async () => {
  let articles;
  try {
    articles = await Article.find();
    if (articles.length === 0) {
      await Article.insertMany(articleDB);
    }
  } catch (err) {
    console.log(err);
  }
});