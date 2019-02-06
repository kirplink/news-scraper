const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: "Title is required"
    },
    summary: {
        type: String,
        required: "Summary is required"
    },
    link: {
        type: String,
        unique: true,
        required: "Link is required"
    }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;