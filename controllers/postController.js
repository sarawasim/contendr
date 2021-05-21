const database = include("databaseConnection/databaseConnection");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");


const postCollection = database.db("Contendr").collection("posts");

const userCollection = database.db("Contendr").collection("users");


async function uploadP2URL(req) {
  await postCollection.updateOne(
    { postId: req.body.postId },
    {
      $set: {
        p2URL: req.body.imageURL,
        isAccepted: true,
        p2FileType: req.body.fileTypeInput,
      },
    }
  );

  await userCollection.updateOne(
    { username: req.user.username },
    { $inc: { pending: -1 } }
  );
}

async function addComment(req) {
  await postCollection.updateOne(
    {
      postId: req.params.id,
    },
    {
      $push: {
        commentList: {
          commentId: uuidv4(),
          comment: req.body.commentInput,
          username: req.user.username,
          userId: req.user.id,
          createdAt: new Date(),
        },
      },
    }
  );
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
      fileTypeInput: Joi.string().required(),
    });
    const validationResult = await schema.validate(req.body);
    if (validationResult.error != null) {
      console.log(validationResult.error);
      res.render("error", { message: "Opps! Something went wrong" });

      throw validationResult.error;
    }

    const postID = uuidv4();
    let date = new Date();
    await postCollection.insertOne({
      postId: postID,
      player1: req.user.username,
      player2: req.body.searchUser,
      category: req.body.categoryInput,
      title: req.body.titleInput,
      description: req.body.descriptionInput,
      p1Likes: {},
      p2Likes: {},
      createdAt: date,
      expiry: new Date(date.getTime() + req.body.timeInput * 1000),
      comments: 0,
      commentList: [],
      timeLimit: req.body.timeInput,
      p1URL: req.body.imageURL,
      p2URL: "/assets/waiting-for-response.jpg",
      isAccepted: false,
      p1FileType: req.body.fileTypeInput,
      p2FileType: "",
    });

    await userCollection.updateMany(
      {
        $or: [
          { username: req.user.username },
          { username: req.body.searchUser },
        ],
      },
      { $push: { posts: { postId: postID } } }
    );

    await userCollection.updateOne(
      { username: req.body.searchUser },
      { $inc: { pending: +1 } }
    );
  } catch (ex) {
    res.render("error", { message: "Error connecting to Mongo" });
    console.log("Error connecting to Mongo");
    console.log(ex);
  }
}

async function likePost(req) {
  const postId = req.params.id;
  const player = req.params.player;
  const posts = await postCollection.find().toArray();

  const targetPost = posts.find((post) => post.postId === postId);

  if (player === "p1") {
    const likesObject = targetPost.p1Likes;
    const unlikeObject = targetPost.p2Likes;
    if (likesObject[`${req.user.email}`]) {
      delete likesObject[`${req.user.email}`];
    } else {
      likesObject[`${req.user.email}`] = true;
      if (unlikeObject[`${req.user.email}`]) {
        delete unlikeObject[`${req.user.email}`];
      }
    }

    await postCollection.updateOne(
      { postId: postId },
      { $set: { p1Likes: likesObject, p2Likes: unlikeObject } }
    );
  } else {
    const likesObject = targetPost.p2Likes;
    const unlikeObject = targetPost.p1Likes;

    if (likesObject[`${req.user.email}`]) {
      delete likesObject[`${req.user.email}`];
    } else {
      likesObject[`${req.user.email}`] = true;
      if (unlikeObject[`${req.user.email}`]) {
        delete unlikeObject[`${req.user.email}`];
      }
    }

    await postCollection.updateOne(
      { postId: postId },
      { $set: { p2Likes: likesObject, p1Likes: unlikeObject } }
    );
  }
}

async function deletePost(req, res) {
  console.log("i am deletePost");
  const postId = req.params.id;
  const posts = await postCollection.find().toArray();

  const targetPost = posts.find((post) => post.postId === postId);

  if (!targetPost.isAccepted) {
    await userCollection.updateOne(
      { username: targetPost.player2 },
      { $inc: { pending: -1 } }
    );
  }

  await userCollection.update(
    {},
    { $pull: { posts: { postId: postId } } },
    { multi: true }
  );

  await postCollection.deleteOne({ postId: postId });
}

async function getPostByCat(category) {
  const results = await database
    .db("Contendr")
    .collection("posts")
    .find({
      category: category,
    })
    .toArray();
  return results;
}

module.exports = {
  createChallenge,
  likePost,
  deletePost,
  uploadP2URL,
  addComment,
  getPostByCat,
};
