//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const { forEach } = require("lodash");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
let posts = [{title: "Day 1", content: "This is the content of day 1"}, {title: "Day 2", content: "This is the content of day 2"}, {title: "Day 3", content: "This is the content of day 3"}];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: posts,
  });
});

app.get("/:topic", function (req, res) {
  if (req.params.topic === "home") {
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: posts,
    });
  } else if (req.params.topic === "contact") {
    res.render("contact", { contactStartingContent: contactContent });
  } else if (req.params.topic === "compose") {
    res.render("compose", { aboutStartingContent: aboutContent });
  } else if (req.params.topic === "about") {
    res.render("about", { aboutStartingContent: aboutContent });
  }
});

app.get("/posts/:postName", function (req, res) {
  // console.log(req.params.postName);
  forEach(posts, function (post) {
    if (_.lowerCase(post.title) === _.lowerCase(req.params.postName)) {
      // console.log("Match found");
      res.render("post", {post: post});
    }
  });
});



// console.log(_.lowerCase(posts[0].title))
app.post("/compose", function (req, res) {
  // console.log(req.body.title);
  const newPost = {
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(newPost);
  console.log(posts);
  res.redirect("/");
});

app.listen(process.env.PORT||3000, function () {
  console.log(`Server started on port`);
});
