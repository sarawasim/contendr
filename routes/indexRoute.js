const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const { upload } = require("../middleware/upload");
const { path } = require("path");
const { createChallenge } = require("../controllers/postController");

const database = include("databaseConnection/databaseConnection");

const {getFollowingUsernames} = require("../controllers/userControllerMongo");

router.get("/", ensureAuthenticated, async (req, res) => {
  let postArray = [];
  const userCollection = database.db("Contendr").collection("users");
  const users = await userCollection
    .find()
    .project({
      id: 1,
      email: 1,
      username: 1,
      posts: 1,
      following: 1,
    })
    .toArray();

  const postCollection = database.db("Contendr").collection("posts");
  const posts = await postCollection.find().toArray();

  console.log("POSTS FROM MONGO !@##%$!@#%$!@#$ " + JSON.stringify(posts));

  const uploadCollection = database.db("Contendr").collection("uploads");
  const uploads = await uploadCollection.find().toArray();

  console.log("UPLOADS FROM MONGO !@##%$!@#%$!@#$ " + JSON.stringify(uploads));

  const thisUser = users.find((user) => user.email === req.user.email);
  console.log(
    "THIS USER +++++++++++++++++============= " + JSON.stringify(thisUser)
  );
  let userFollowersArray = [];
  thisUser["following"].forEach((userFollower) => {
    let followerProfile = users.find((user) => user.id === userFollower.id);
    userFollowersArray.push(followerProfile);
  });

  let feedPostsArray = [];
  thisUser["posts"].forEach((userPost) => {
    console.log("USERPOST )))))))))" + JSON.stringify(userPost));
    let userPostData = posts.find((post) => post.postId == userPost.postId);
    feedPostsArray.push(userPostData);
  });
  console.log(
    "----------------- Feed Posts ------ " + JSON.stringify(feedPostsArray)
  );

  console.log(
    "FOLLOWER ARRAY !@#$!@#$!@#$@#$@#$@#$ " + JSON.stringify(userFollowersArray)
  );
  userFollowersArray.forEach((follower) => {
    follower["posts"].forEach((followerPost) => {
      let followerPostData = posts.find((post) => {
        post.postId === followerPost.id;
      });
      feedPostsArray.push(followerPostData);
    });
  });

  for (i = 0; i < feedPostsArray.length - 1; i++) {
    console.log(
      "----------- Feed Posts length ------ " + feedPostsArray.length
    );
    for (j = 0; j < uploads.length; j++) {
      console.log("----------- uploads array length ------ " + uploads.length);
      if (feedPostsArray[i].p1UploadId === uploads[j].id) {
        feedPostsArray[i]["p1Upload"] = uploads[j];
      }
      if (feedPostsArray[i]["p2UploadId"] === uploads[j].id) {
        feedPostsArray[i]["p2Upload"] = uploads[j];
      }
    }
  }
  // Array of posts are passed into the ejs. Creates different divs that // Takes in an arrayOfPosts[] that are associated with the signed in user.
  // contain each post

  console.log(
    "----------------- Feed Posts ------ " + JSON.stringify(feedPostsArray)
  );
  // Each post contains urls to each video. display the urls in the ejs page.
  res.render("index", { feedPosts: feedPostsArray });
});

router.get("/createChallenge", ensureAuthenticated, async (req, res) => {
  console.log("in the get");
  let following = await getFollowingUsernames(req.user.following)
  console.log("console logging array from router.get")
  console.log(following)
  res.render("createChallenge", { layout: "layoutB"});
});

router.post("/createChallenge/searchUsername", (req, res) => {
  let user = getUsername(req.body.searchUser);
  if (user) {
    console.log("sucess");
    res.render("/createChallenge", { user });
  } else console.log("failed");
});

router.post(
  "/createChallenge",
  ensureAuthenticated,
  upload.single("fileUpload"),
  (req, res) => {
    console.log("testing req.body");
    console.log(req.file.filename);
    let filename = req.file.filename;
    createChallenge(req, res);
    res.render("test", { image: "tempImages/" + filename });
    // need to add form data and upload url into Mongo DB's "posts" collection
  }
);

module.exports = router;
