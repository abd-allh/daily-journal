const express = require("express")
const _ = require("lodash")
const mongoose = require("mongoose")
const { Post, defaultItems } = require("./Model")

require("dotenv").config({ path: "vars/.env" })
const MUSER = process.env.USER
const MPASS = process.env.PASS

const app = express()
const port = process.env.PORT || 3000
const uri =
  "mongodb+srv://" +
  MUSER +
  ":" +
  MPASS +
  "@abdallah.qb7z6xt.mongodb.net/blogDB?retryWrites=true&w=majority"

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

var posts = []

main().catch((err) => console.log(err))
async function main() {
  await mongoose.connect(uri)
}

app.get("/", async (req, res) => {
  const foundPosts = await Post.find({})

  if (!(await Post.exists())) {
    await Post.insertMany(defaultItems[1])
    res.redirect("/")
  } else {
    res.render("home", {
      startingContent: defaultItems[0],
      posts: foundPosts,
    })
  }
})

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: defaultItems[2] })
})

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: defaultItems[3] })
})

app.get("/compose", (req, res) => {
  res.render("compose")
})

app.get("/posts/:postId", async (req, res) => {
  const requestedPostId = req.params.postId

  const post = await Post.findOne({ _id: requestedPostId })

  res.render("post", { title: post.title, content: post.content })
})

app.post("/compose", async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    url: "/posts/" + req.body.postTitle.replace(/\s+/g, "-").toLowerCase(),
  })

  await post.save()
  res.redirect("/")
})

app.listen(port, function (err) {
  if (err) console.log(err)
  console.log(`Listening on PORT ${port}.`)
})
