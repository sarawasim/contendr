const database = include("databaseConnection/databaseConnection");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

async function createChallenge(req, res) {
  console.log("i'm here!")
  try{
    console.log
    console.log("i'm in the try")
    const schema = await Joi.object({
      descriptionInput: Joi.string().max(150).required(),
      titleInput: Joi.string().max(50).required(),
      categoryInput: Joi.string().required(),
      searchUser: Joi.string().required(),
      timeInput: Joi.string().required()
    })
    const validationResult = await schema.validate(req.body);
    if (validationResult.error != null) {
      console.log(validationResult.error);
      res.render("error", { message: "Opps! Something went wrong"})

      throw validationResult.error
    } 
    console.log("this is req.body")
    console.log(req.body)
    console.log("this is req.user")
    console.log(req.user)

    const postCollection = database.db("Contendr").collection("posts");
    await postCollection.insertOne({
      id: uuidv4(),
      player1: req.user.username,
      player2: req.body.searchUser,
      category: req.body.categoryInput,
      title: req.body.titleInput,
      description: req.body.descriptionInput,
      p1Likes: [],
      p2Likes: [],
      createdAt: new Date(),
      comments: [],
      commentList: [],
      timeLimit: req.body.timeInput
    })
  } catch (ex) {
    console.log("i'm in the catch")
    res.render("error", { message: "Error connecting to Mongo" });
    console.log("Error connecting to Mongo");
    console.log(ex);
  }
}

module.exports = { createChallenge }