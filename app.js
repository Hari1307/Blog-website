//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");


// connection to mongodb
mongoose.connect("mongodb://0.0.0.0:27017/blogDB", (err) => {
  if (!err) {
    console.log("successfully connected to database");
  }
  else {
    console.log("error");
  }
});


// creating the schema : 
const postSchema = mongoose.Schema({
  title: String,
  content : String
})

// creating the model : with this only we will access the data from the document and query
const PostBlog = mongoose.model("Posts", postSchema);




const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let posts = [];

app.get("/", function (req, res) {
  PostBlog.find({}, (err, post) => {
    res.render("home", {
      startingContent : homeStartingContent,
      posts: post
    })
  })
  
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  // here we are fetching the data from entered by the blog post with title and content 
  const post = new PostBlog({
    title: req.body.postTitle,
    content: req.body.postBody
  })

  // if now i save this post then it will be saved in the database 
  post.save((err) => {
    if(!err)
      res.redirect("/");
  });
});

// from home page we are keeping the <a></a> tag with this posts/postid parameter there post is comes from the model name in (here model means the collection in the database) so from this we are accessing the _id of the documents present inside that collection.
//so that in app.js page we are accessing that postId and querying the id and then we are getting the correct document as per the id and rendering the document in the new page  

app.get("/posts/:postId", function (req, res) {
  const requestedId = req.params.postId;
  PostBlog.findById(requestedId, (err, post) => {
    if (!err) {
      console.log(post);
      res.render("post", {
        title: post.title,
        content : post.content
      })
    }
  })
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
