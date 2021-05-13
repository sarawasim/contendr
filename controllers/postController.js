const database = include("databaseConnection/databaseConnection");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

async function uploadP2URL(req) {
  const postCollection = database.db("Contendr").collection("posts");
  console.log(`this is req.body.imageURL ${req.body.imageURL}` )
  console.log(`this is postId ${req.body.postId}`)
  await postCollection.updateOne(
    { postId: req.body.postId },
    { $set: { p2URL: req.body.imageURL, isAccepted: true } }
    )
}

async function createChallenge(req, res) {
  try {
    const schema = await Joi.object({
      descriptionInput: Joi.string().max(150).required(),
      titleInput: Joi.string().max(50).required(),
      categoryInput: Joi.string().required(),
      searchUser: Joi.string().required(),
      timeInput: Joi.string().required(),
      imageURL: Joi.string().required(),
      followingList: Joi.string().allow(null).allow("").optional(),
    });
    const validationResult = await schema.validate(req.body);
    if (validationResult.error != null) {
      console.log(validationResult.error);
      res.render("error", { message: "Opps! Something went wrong" });

      throw validationResult.error;
    }

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
      isAccepted: false
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

async function likePost(req) {
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
}

async function deletePost(req, res) {
  const postId = req.params.id;

  console.log("UPLOAD ID IS !!!!!!!!!!!!!!!!!!!!!!! " + JSON.stringify(postId));

  const postCollection = database.db("Contendr").collection("posts");
  await postCollection.deleteOne({ postId: postId });

  const userCollection = database.db("Contendr").collection("users");
  await userCollection.update(
    {},
    { $pull: { posts: { postId: postId } } },
    { multi: true }
  );
}

module.exports = { createChallenge, likePost, deletePost, uploadP2URL };
