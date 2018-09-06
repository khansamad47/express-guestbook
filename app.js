var http = require('http');
var path = require('path');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const PORT = process.env.PORT || 3000;
const MONGODB_URI=process.env.MONGODB_URI;

var app = express();
var db;

console.log("Attempt to connect to", MONGODB_URI);
MongoClient.connect(MONGODB_URI, {useNewUrlParser: true},function(err, client) {
    if (err !== null) {
        console.log("Failed to connect to db. err=", err);
        return;
    }
    console.log("Connected to mongodb server.");
    db = client.db(process.env.MONGODB_DB);
});

app.set("view engine", "ejs");

// Middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req,res) {
    console.log("Request", req.body);
    db.collection('posts').find().toArray(function(err,docs) {
        res.render("index", {entries : docs}); });
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
    db.collection('posts').insert(req.body);
    res.send("Saved!");
});

app.use(function(req,res){
    res.status(404).render("404");
});

http.createServer(app).listen(PORT, () => {
    console.log("Guestbook app started on 3000");
});
