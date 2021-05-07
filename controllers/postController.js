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
      followingList: Joi.string()
    });
    const validationResult = await schema.validate(req.body);
    if (validationResult.error != null) {
      console.log(validationResult.error);
      res.render("error", { message: "Opps! Something went wrong" });

      throw validationResult.error;
    }
    
    const postCollection = database.db("Contendr").collection("posts");
    await postCollection.insertOne({
      id: uuidv4(),
      player1: req.user.username,
      player2: req.body.searchUser,
      category: req.body.categoryInput,
      title: req.body.titleInput,
      description: req.body.descriptionInput,
      p1Likes: {},
      p2Likes: {},
      createdAt: new Date(),
      comments: [],
      commentList: [],
      timeLimit: req.body.timeInput,
      p1URL: req.body.imageURL,
      p2URL: "",
    });
  } catch (ex) {
    console.log("i'm in the catch");
    res.render("error", { message: "Error connecting to Mongo" });
    console.log("Error connecting to Mongo");
    console.log(ex);
  }
}

async function likePost(req, res) {
  const uploadId = req.params;
  console.log(
    "UPLOAD ID IS !!!!!!!!!!!!!!!!!!!!!!! " + JSON.stringify(uploadId)
  );

  const uploadCollection = database.db("Contendr").collection("uploads");
  const uploads = await uploadCollection.find().toArray();

  const targetUpload = uploads.find((upload) => upload.id === uploadId.id);
  console.log(
    "TARGETTED UPLOAD in likes function !!!!!!!!!!!!!!!!!!!!!!! " + targetUpload
  );

  const likesObject = targetUpload.likes;

  if (likesObject[`${req.user.email}`]) {
    delete likesObject[`${req.user.email}`];
  } else {
    likesObject[`${req.user.email}`] = true;
  }

  await uploadCollection.updateOne(
    { id: uploadId.id },
    { $set: { likes: likesObject } }
  );
  // await uploadCollection.findOneAndUpdate({id:uploadId},{$set: {"likes": }})

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
