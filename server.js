const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articledb";
console.log(MONGODB_URI);
mongoose.connect(MONGODB_URI);

// Set Handlebars as the default templating engine.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/routes.js")(app);

app.listen(PORT, function() {
  console.log("Runnig on http://localhost:" + PORT);
});
