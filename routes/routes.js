// dependencies
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = (app) => {
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
                res.redirect("/");
              })
              .catch(function(err) {
                // res.json(err);
              });
          })
        });
      });
      
      app.get("/", function(req, res) {
          db.Article.find({})
              .then(function(dbArticle) {
                  res.render("index", {dbArticle});
              })
              .catch(function(err) {
                  res.json(err);
              });
      });

      app.get("/article/saved", function(req, res) {
        db.Article.find({saved: true})
          .then(function(dbArticle) {
            res.render("saved", {dbArticle});
          })
          .catch(function(err) {
            res.json(err);
          })
      });
      
      app.get("/article/save/:id", function(req, res) {
        var id = req.params.id
        db.Article.findByIdAndUpdate(id, { saved: true})
          .then(function(dbArticle) {
            // dbArticle.remove();
            res.redirect("back");
          })
          .catch(function(err) {
            res.redirect("/");
          })
      });

      app.get("/article/unsave/:id", function(req, res) {
        var id = req.params.id
        db.Article.findByIdAndUpdate(id, { saved: false})
          .then(function(dbArticle) {
            // dbArticle.remove();
            res.redirect("back");
          })
          .catch(function(err) {
            res.redirect("/");
          })
      });
      
      app.get("/article/clear", function(req, res) {
        db.Article.find({saved: false}).remove()
          .then(function(dbArticle) {
            res.redirect("back");
          })
          .catch(function(err) {
            res.json(err);
          })
      });
      
      app.get("/article/delete/:id", function(req, res) {
        var id = req.params.id
        db.Article.findByIdAndRemove(id)
          .then(function(dbArticle) {
            res.redirect("/")
          })
          .catch(function(err) {
            res.json(err);
          });
      });

      app.get("/comment/delete/:id", function(req, res) {
        var id = req.params.id
        db.Note.findByIdAndRemove(id)
          .then(function(dbNote) {
            res.redirect("back")
          })
          .catch(function(err) {
            res.json(err);
          });
      });
      
      app.get("/article/detail/:id", function(req, res) {
        var id = req.params.id;
        db.Article.findById(id)
          .populate("notes")
          .then(function(dbArticle) {
            // res.json(dbArticle);
            notes = dbArticle.notes;
            // console.log(notes);
            res.render("article", {
              link: dbArticle.link,
              title: dbArticle.title,
              summary: dbArticle.summary,
              saved: dbArticle.saved,
              _id: dbArticle._id,
              notes
            });
          });
      });
      
      app.post("/articles/comment/:id", function(req, res) {
        console.log(req.body);
        db.Note.create(req.body)
          .then(function(dbNote) {
            // console.log(dbNote._id);
            console.log(req.params.id);
            // const artID = req.params.id
            // db.Article.findById(artID)
            // .then(function(dbArticle) {
            //     console.log(dbArticle);
            // })
            return db.Article.findByIdAndUpdate(req.params.id, { $push: {notes: dbNote._id} }, { new: true });
          })
          .then(function(dbArticle) {
            res.redirect("back");
          })
          .catch(function(err) {
            res.json(err);
          });
      })
}