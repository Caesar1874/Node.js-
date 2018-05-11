
const express = require("express");
// const request = require("superagent");

const search = require("./search");
const app = express();

//
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view options", {layout: false});

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/search", function(req, res, next) {
    const keyword = req.query["keyword"];
    search(keyword, function(err, results) {
        if(err) {
            return next(err);
        } else {
            res.render("search", {results: results, keyword: keyword});
        }
    })
})

app.listen(3000);
