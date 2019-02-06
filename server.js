const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const mongoose = require("mongoose");

const db = require("./models");

const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb://localhost/articledb", { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
  axios.get("https://www.npr.org/sections/science/").then(function(response) {
    const $ = cheerio.load(response.data);

    $("article").each(function(i, element) {
      let result = {};
      result.title = $(this)
        .find(".title")
        .text();
      result.summary = $(this)
        .find(".teaser")
        .text();
      result.link = $(this)
        .find("a")
        .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.listen(PORT, function() {
  console.log("Runnig on http://localhost:" + PORT);
});
