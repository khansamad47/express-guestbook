var http = require('http');
var path = require('path');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

var entries = [];

app.locals.entries = entries;

app.set("view engine", "ejs");

// Middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req,res) {
    console.log("Request", req.body);
    res.render("index");
});

app.get("/create", function(req,res) {
    console.log("Request", req.body);
    res.render("create");
});

app.post("/create", function(req,res) {
    console.log("Request", req.body);
    if (req.body.name === "" || req.body.message === "") {
        res.send("name or message was empty!");
    }
    entries.push(req.body);
    res.send("Saved!");
});

app.use(function(req,res){
    res.status(404).render("404");
});

http.createServer(app).listen(3000, () => {
    console.log("Guestbook app started on 3000");
});
