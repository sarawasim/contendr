const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const { upload } = require("../middleware/upload");
const { path } = require("path");
const {
  createChallenge,
  likePost,
  deletePost,
  uploadP2URL,
  addComment,
  getPostByCat,
} = require("../controllers/postController");

const database = include("databaseConnection/databaseConnection");

const {
  getFollowingUsernames,
  findUsernames,
  getUserByUsername,
  toggleFollowUser,
  checkFollowing,
  getList,
} = require("../controllers/userControllerMongo");

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
      pending: 1,
    })
    .toArray();

  const postCollection = database.db("Contendr").collection("posts");
  const posts = await postCollection.find().toArray();

  const thisUser = users.find((user) => user.email === req.user.email);

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

      if (!alreadyHasPost) {
        let followerPostData = posts.find((post) => {
          return post.postId === followerPost.postId;
        });
        feedPostsArray.push(followerPostData);
      }
    });
  });

  let filteredPostArray = feedPostsArray.filter(
    (post) => post.isAccepted === true
  );
    
  // Each post contains urls to each video. display the urls in the ejs page.
  res.render("index", { feedPosts: filteredPostArray, user: req.user });
});

router.get("/createChallenge", ensureAuthenticated, async (req, res) => {
  let following = await getFollowingUsernames(req.user.following);
  console.log(`following from createChallenge route ${following}`)
  res.render("createChallenge", {
    layout: "layoutB",
    following: following,
    user: req.user,
  });
});

router.post("/createChallenge/searchUsername", (req, res) => {
  let user = getUsername(req.body.searchUser);
  if (user) {
    res.render("/createChallenge", { user });
  } else console.log("failed");
});

router.get("/search", async (req, res) => {
  let input = req.query.searchInput.toLowerCase();
  const results = await findUsernames(input);
  let title = "Showing search results"
  res.render("searchResults", { results, user: req.user, title });
});

router.get("/showFollowing", async (req, res) => {
  let username = req.query.username
  let following = await getList(username, "following")
  let title = `Users ${username} is following`
  res.render("searchResults", { results: following, user: req.user, title });

})

router.get("/showFollowers", async (req, res) => {
  let username = req.query.username
  let followers = await getList(username, "followers")
  let title = `${username}'s followers`
  res.render("searchResults", { results: followers, user: req.user, title });

})

router.post(
  "/createChallenge",
  ensureAuthenticated,
  upload.single("fileUpload"),
  (req, res) => {
    createChallenge(req, res);
    res.redirect("/userProfile");
  }
);

router.get("/:id/:player/like", (req, res) => {
  likePost(req);
  res.status(204).end();
});

router.get("/:id/deletePost", async (req, res) => {
  deletePost(req);
  res.redirect("/userProfile");
});

router.get("/:username/toggleFollow", async (req, res) => {
  toggleFollowUser(req);
  res.redirect("back");
});

router.get("/userProfile", ensureAuthenticated, async (req, res) => {
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

  const thisUser = users.find((user) => user.email === req.user.email);

  let postsArray = [];
  thisUser["posts"].forEach((userPost) => {
    let userPostData = posts.find((post) => post.postId === userPost.postId);
    postsArray.push(userPostData);
  });

  res.render("userProfile", {
    layout: "layout",
    user: req.user,
    posts: postsArray,
  });
});

router.get("/profile", ensureAuthenticated, async (req, res) => {
  const postCollection = database.db("Contendr").collection("posts");
  const posts = await postCollection.find().toArray();

  let username = req.query.username;
  let searchedUser = await getUserByUsername(username);

  let postsArray = [];
  searchedUser["posts"].forEach((userPost) => {
    let userPostData = posts.find((post) => post.postId === userPost.postId);
    postsArray.push(userPostData);
  });

  let isFollowing = await checkFollowing(req.user.following, searchedUser.id);
  if (req.query.username === req.user.username) {
    res.redirect("/userProfile");
  } else {
    res.render("profile", {
      layout: "layout",
      searchedUser,
      user: req.user,
      isFollowing,
      posts: postsArray,
    });
  }
});

router.get("/p", ensureAuthenticated, async (req, res) => {
  // router to Individual post
  const postId = req.query.postId;

  const postCollection = database.db("Contendr").collection("posts");
  const posts = await postCollection.find().toArray();

  const post = posts.find((post) => post.postId === postId);

  res.render("post", { layout: "layout", post, user: req.user });
});

router.post("/post/:id/comment", (req, res) => {
  addComment(req);
  res.redirect(`/p?postId=${req.params.id}#commentInput`);
});

router.get("/notifications", ensureAuthenticated, async (req, res) => {
  const feedPostsArray = await database
    .db("Contendr")
    .collection("posts")
    .find({
      player2: req.user.username,
      isAccepted: false,
    })
    .toArray();

  res.render("notifications", { feedPosts: feedPostsArray, user: req.user });
});

router.get("/accept", ensureAuthenticated, async (req, res) => {
  const postId = req.query.postId;

  const postCollection = database.db("Contendr").collection("posts");
  const posts = await postCollection.find().toArray();

  const post = posts.find((post) => post.postId === postId);

  res.render("acceptChallenge", { layout: "layoutC", post, user: req.user });
});

router.get("/explore", ensureAuthenticated, (req, res) => {

  res.render("explore", { user: req.user });
})

router.get("/show", ensureAuthenticated, async (req, res) => {
  let feedPosts = await getPostByCat(req.query.category)
  res.render("show", {layout: "layout", feedPosts, user: req.user, cat: req.query.category })
})

router.post("/updateP2URL", ensureAuthenticated, upload.single("fileUpload"), (req, res) => {
  uploadP2URL(req);
  res.redirect(`/p?postId=${req.body.postId}`);
});

router.get("/faq", (req, res) => {
  res.render("faq", {user: req.user})
})
router.get("/termsOfUse", (req, res) => {
  res.render("terms", {user: req.user})
})
router.get("/privacyPolicy", (req, res) => {
  res.render("privacy", {user: req.user})
})
router.get("/help", (req, res) => {
  res.render("help", {user: req.user})
})

module.exports = router;
