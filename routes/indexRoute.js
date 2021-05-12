const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const { upload } = require("../middleware/upload");
const { path } = require("path");
const { createChallenge, likePost } = require("../controllers/postController");

const database = include("databaseConnection/databaseConnection");


const { getFollowingUsernames, findUsernames, getUserByUsername, toggleFollowUser, checkFollowing } = require("../controllers/userControllerMongo");

router.get("/", ensureAuthenticated, async (req, res) => {
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
    let userPostData = posts.find((post) => post.postId === userPost.postId);
    feedPostsArray.push(userPostData);
  });

  userFollowersArray.forEach((follower) => {
    follower["posts"].forEach((followerPost) => {
      let alreadyHasPost = feedPostsArray.find((feedPost) => {
        return feedPost.postId === followerPost.postId;
      });

      console.log("FOLLOWER POST ~~~~~~~~~~~ " + JSON.stringify(followerPost));

      console.log("ALREADY HAS ~~~~~~~~~~~ " + JSON.stringify(alreadyHasPost));

      if (!alreadyHasPost) {
        let followerPostData = posts.find((post) => {
          return post.postId === followerPost.postId;
        });
        feedPostsArray.push(followerPostData);
      }
    });
  });

  // for (i = 0; i < feedPostsArray.length; i++) {
  //   console.log(
  //     "----------- Feed Posts length ------ " + feedPostsArray.length
  //   );
  //   for (j = 0; j < uploads.length; j++) {
  //     console.log("----------- uploads array length ------ " + uploads.length);
  //     if (feedPostsArray[i]) {
  //       if (feedPostsArray[i].p1UploadId === uploads[j].id) {
  //         feedPostsArray[i]["p1Upload"] = uploads[j];
  //       }
  //       if (feedPostsArray[i]["p2UploadId"] === uploads[j].id) {
  //         feedPostsArray[i]["p2Upload"] = uploads[j];
  //       }
  //     }
  //   }
  // }
  // Array of posts are passed into the ejs. Creates different divs that // Takes in an arrayOfPosts[] that are associated with the signed in user.
  // contain each post

  console.log(
    "----------------- Feed Posts ------ " + JSON.stringify(feedPostsArray)
  );
  // Each post contains urls to each video. display the urls in the ejs page.
  res.render("index", { feedPosts: feedPostsArray, user: req.user });
});

router.get("/createChallenge", ensureAuthenticated, async (req, res) => {
  console.log("in the get");
  let following = await getFollowingUsernames(req.user.following);
  console.log("console logging array from router.get");
  console.log(following);
  res.render("createChallenge", { layout: "layoutB", following: following });
});

router.post("/createChallenge/searchUsername", (req, res) => {
  let user = getUsername(req.body.searchUser);
  if (user) {
    console.log("sucess");
    res.render("/createChallenge", { user });
  } else console.log("failed");
});

router.get("/search", async (req, res) => {
  let input = req.query.searchInput;
  console.log(`from the get, the input is ${input}`);
  const results = await findUsernames(input);
  console.log(`the results are: ${results}`);
  res.render("searchResults", { results });
});

router.post(
  "/createChallenge",
  ensureAuthenticated,
  upload.single("fileUpload"),
  (req, res) => {
    createChallenge(req, res);
    res.redirect("/");
  }
);

router.get("/:id/:player/like", (req, res) => {
  likePost(req, res);
});


router.get("/:username/toggleFollow", async (req, res) => {
  toggleFollowUser(req);
  res.redirect("back")
})

router.get("/userProfile", ensureAuthenticated, async (req, res) => {
  res.render("userProfile", { layout: "layout", user: req.user });
});

router.get("/profile", async (req, res) => {
  let username = req.query.username;
  let user = await getUserByUsername(username);

  res.render("profile", { layout: "layout", user });
});

router.get("/p", async (req, res) => {
  // router to Individual post
  const postId = req.query.postId;

  const postCollection = database.db("Contendr").collection("posts");
  const posts = await postCollection.find().toArray();

  const post = posts.find((post) => post.postId === postId);

  console.log(" !@!@!@!@!@!@!@!@ ");
  console.log("INDIV POST !@!@!@!@!@!@!@!@ " + JSON.stringify(post));
  console.log(" !@!@!@!@!@!@!@!@ ");

  res.render("post", { layout: "layout", post, user: req.user });
});

module.exports = router;
