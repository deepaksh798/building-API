const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { log } = require("console");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articlesSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articlesSchema);

//////////////////////////Requests targeting all articles///////////////////////

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({})
      .then(function (foundArticles) {
        res.send(foundArticles);
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle
      .save({})
      .then(function () {
        res.send("Successfully added a new article.");
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .delete(function (req, res) {
    Article.deleteMany({})
      .then(function () {
        res.send("Successfully deleted all articles.");
      })
      .catch(function (err) {
        res.render(err);
      });
  });

//////////////////////////Requests targeting specific article///////////////////////

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    {
      title: req.params.articleTitle;
    }
    Article.findOne({})
      .then(function (foundArticle) {
        res.send(foundArticle);
      })
      .catch(function () {
        res.send("no article matching that title was found");
      });
  })

  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content }
      // { overwrite: true }
    )
      .then(() => {
        console.log("Succesfully updated article");
        res.send("Successfully updated article");
      })
      .catch((err) => {
        console.log("Error", err);
      });
  })

  .patch(function (req, res) {
    Article.updateOne({ title: req.params.articleTitle }, { $set: req.body })
      .then(() => {
        res.send("Successfully updated article.");
      })
      .catch((err) => {
        res.send(err);
      });
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle })
      .then(() => {
        res.send("Successfully deleted the article");
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
