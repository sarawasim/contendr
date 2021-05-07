const database = include("databaseConnection/databaseConnection");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

async function createChallenge(req, res) {
  console.log("i'm here!");
  try {
    console.log;
    console.log("i'm in the try");
    const schema = await Joi.object({
      descriptionInput: Joi.string().max(150).required(),
      titleInput: Joi.string().max(50).required(),
      categoryInput: Joi.string().required(),
      searchUser: Joi.string().required(),
      timeInput: Joi.string().required(),
      imageURL: Joi.string().required(),
      followingList: Joi.string(),
    });
    const validationResult = await schema.validate(req.body);
    if (validationResult.error != null) {
      console.log(validationResult.error);
      res.render("error", { message: "Opps! Something went wrong" });

      throw validationResult.error;
    }
    console.log("this is req.body");
    console.log(req.body);
    console.log("this is req.user");
    console.log(req.user);

    const postID = uuidv4();
    const postCollection = database.db("Contendr").collection("posts");
    await postCollection.insertOne({
      postId: postID,
      player1: req.user.username,
      player2: req.body.searchUser,
      category: req.body.categoryInput,
      title: req.body.titleInput,
      description: req.body.descriptionInput,
      p1Likes: {},
      p2Likes: {},
      createdAt: new Date(),
      comments: 0,
      commentList: [],
      timeLimit: req.body.timeInput,
      p1URL: req.body.imageURL,
      p2URL: "",
    });

    const userCollection = database.db("Contendr").collection("users");
    await userCollection.updateMany(
      {
        $or: [
          { username: req.user.username },
          { username: req.body.searchUser },
        ],
      },
      { $push: { posts: { postId: postID } } }
    );
  } catch (ex) {
    console.log("i'm in the catch");
    res.render("error", { message: "Error connecting to Mongo" });
    console.log("Error connecting to Mongo");
    console.log(ex);
  }
}

async function likePost(req, res) {
  const postId = req.params.id;
  const player = req.params.player;

  console.log("UPLOAD ID IS !!!!!!!!!!!!!!!!!!!!!!! " + JSON.stringify(postId));

  const postCollection = database.db("Contendr").collection("posts");
  const posts = await postCollection.find().toArray();

  const targetPost = posts.find((post) => post.postId === postId);
  console.log(
    "TARGETTED UPLOAD in likes function !!!!!!!!!!!!!!!!!!!!!!! " + targetPost
  );

  if (player === "p1") {
    const likesObject = targetPost.p1Likes;

    if (likesObject[`${req.user.email}`]) {
      delete likesObject[`${req.user.email}`];
    } else {
      likesObject[`${req.user.email}`] = true;
    }

    await postCollection.updateOne(
      { postId: postId },
      { $set: { p1Likes: likesObject } }
    );
  } else {
    const likesObject = targetPost.p2Likes;

    if (likesObject[`${req.user.email}`]) {
      delete likesObject[`${req.user.email}`];
    } else {
      likesObject[`${req.user.email}`] = true;
    }

    await postCollection.updateOne(
      { postId: postId },
      { $set: { p2Likes: likesObject } }
    );
  }

  // await uploadCollection.findOneAndUpdate({id:postId},{$set: {"likes": }})

  // database.users.forEach((user) => {
  //   for (let i = 0; i < user.posts.length; i++) {
  //     if (user.posts[i]) {
  //       if (user.posts[i].postId === postId.toString()) {
  //         if (user.posts[i].likes[username]) {
  //           delete user.posts[i].likes[username];
  //           return;
  //         }
  //         user.posts[i].likes[username] = true;
  //       }
  //     }
  //   }
  // });
}

module.exports = { createChallenge, likePost };
