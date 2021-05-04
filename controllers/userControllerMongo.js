const userModel = require("../models/userModelMongo").userModel;
const database = include("databaseConnection/databaseConnection");

const Joi = require("joi");
const { ObjectId } = require("bson");
const { v4: uuidv4 } = require("uuid");
const passwordPepper = "S3cr3+oD3lCli3nt3";
const crypto = require("crypto");

const getUserByEmailIdAndPassword = async (email, password) => {
  let user = await userModel.findOne(email);
  console.log("getUserByEmailIdAndPassword --- user: " + JSON.stringify(user));
  if (user) {
    if (await isUserValid(user, password)) {
      return user;
    }
  }
  return null;
};

const getUsername = (input) => {
  let user = userModel.findByUsername(input)
  if (user) {
    return user
  }
}

const getUserById = (id) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user, password) {
  console.log(
    "isUserValid --- user password is " +
      JSON.stringify(user.password) +
      " , and inputed password is " +
      password
  );
  return user.password === password;
}

async function findOrCreate(profile) {
  console.log("find or create has been reached +++++++++++++++");

  //will first find if user is in DB, and if not then user will be added to DB
  // console.log(
  //   "\nthe name of profile is --------- " + JSON.stringify(profile._json.name)
  // );
  let user = await userModel.findById(parseInt(profile.id));
  if (user) {
    return user;
  } else {
    console.log("creating has been reached");
    const userCollection = database.db("Contendr").collection("users");
    await userCollection.insertOne({
      id: parseInt(profile.id),
      email: profile.emails[0].value,
      username: profile.displayName,
      Posts: [],
      following: [],
    });
    user = await userModel.findById(parseInt(profile.id)); //this will find user again after they have been added to DB
    return user;
  }
}

async function registerUser(req, res) {
  let user = await userModel.findOne(req.body.email);
  console.log("register user function user ------ " + JSON.stringify(user));
  if (user) {
    console.log(`User with email ${user.email} already exists.`);
    return new Error(`User with email ${user.email} already exists.`);
  } else {
    try {
      console.log("form submit");
      console.log(req.body);

      // const schema = await Joi.string().max(15).required();
      // const validationResult = await schema.validate(req.body.first_name);
      // if (validationResult.error != null) {
      //   console.log(validationResult.error);
      //   throw validationResult.error;
      // }

      const schema = await Joi.object({
        email: Joi.string().min(5).max(40).required(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),
        username: Joi.string().max(15).required(),
        email: Joi.string().max(50).required(),
        //regex allows only letters and number. NOT Special characters
      });
      const validationResult = await schema.validate(req.body);
      if (validationResult.error != null) {
        console.log(validationResult.error);
        res.render("error", { message: "Error: Trying to add invalid user" });

        throw validationResult.error;
      }

      const password_salt = crypto.createHash("sha512");

      password_salt.update(uuidv4());

      const password_hash = crypto.createHash("sha512");

      password_hash.update(req.body.password + passwordPepper + password_salt);

      const userCollection = database.db("Contendr").collection("users");
      await userCollection.insertOne({
        id: uuidv4(),
        email: req.body.email,
        username: req.body.username,
        password_salt: password_salt.digest("hex"),
        password_hash: password_hash.digest("hex"),
        Posts: [],
        following: [],
      });
      res.redirect("/auth/login");
    } catch (ex) {
      res.render("error", { message: "Error connecting to Mongo" });
      console.log("Error connecting to Mongo");
      console.log(ex);
    }
  }
}

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
  findOrCreate,
  registerUser,
  getUsername,
};
