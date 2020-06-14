const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

const mongoPW = process.env.MONGO_PASS;

// Connect to the mongoDB database named wikiDB
mongoose.connect("mongodb+srv://wikiAPI-jonne:" + mongoPW + "@cluster0-njnqd.mongodb.net/wikiDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

/////////////////////////// Requests targeting all articles ///////////////////////////

app.route("/articles")
.get((req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})
.post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err) => {
        if (!err) {
            res.send("Succesfully added the article to the database.");
        } else {
            res.send(err);
        }
    });
})
.delete((req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send("Succesfully deleted all articles.")
        } else {
            res.send(err);
        }
    });
});

/////////////////////////// Requests targeting a specific article ///////////////////////////

app.route("/articles/:articleTitle")
.get((req, res) => {
    
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found.");
        }
    });
})
.put((req, res) => {
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title,
        content: req.body.content},
        {overwrite: true},
        (err) => {
            if (!err) {
                res.send("Succesfully updated article.");
            }
        }
    );
})
.patch((req, res) => {
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err) => {
            if (!err) {
                res.send("Succesfully updated article.");
            } else {
                res.send(err);
            }
        }
    );
})
.delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}, (err) => {
        if (!err) {
            res.send("Succesfully deleted the article.");
        } else {
            res.send(err);
        }
    });
});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});