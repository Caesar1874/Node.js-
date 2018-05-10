
var express = require("express");
// var request = require("superagent");

var search = require("./search");
var app = express();

//
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view options", {layout: false});

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/search", function(req, res, next) {
    var keyword = req.query["keyword"];
    search(keyword, function(err, results) {
        if(err) {
            return next(err);
        } else {
            res.render("search", {results: results, keyword: keyword});
        }
    })
})

app.listen(3000);
