const userModel = require("../models/userModelMongo").userModel;
const database = include("databaseConnection/databaseConnection");

const Joi = require("joi");
const { ObjectId } = require("bson");
const { v4: uuidv4 } = require("uuid");
const passwordPepper = "S3cr3+oD3lCli3nt3";
const crypto = require("crypto");

const getUserByEmailIdAndPassword = async (email, password) => {
  let user = await userModel.findOne(email);

  if (user) {
    if (await isUserValid(user, password)) {
      return user;
    }
  }
  return null;
};

const getUserById = (id) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

const getUserByUsername = (username) => {
  let user = userModel.findByUsername(username);
  if (user) {
    return user;
  }
  return null;
}

const findUsernames = async (input) => {
  let list = await userModel.searchUsernames(input);
  
  return list;
}
const getList = async (username, type) => {
  let user = await getUserByUsername(username)
  let list;
  if (type == "following") {
    list = user.following
  } else {
    list = user.followers
  }
  let usernameArr = [];
  await Promise.all(
    list.map(async (id) => {
      try {
        let user = await getUserById(id.id)
        usernameArr.push({username: user.username})
      } catch (error) {
        console.log(error);
      }
    })
  )
    return usernameArr;
}

const getFollowingUsernames = async (input) => {
  let userArr = [];
  await Promise.all(
    input.map(async (id) => {
      try {
        let username = await getUserById(id.id);
        userArr.push(username.username);
      } catch (error) {
        console.log(error);
      }
    })
  );
  return userArr;
};

const checkFollowing = (followingList, otherId) => {
  const checkFollowing = followingList.find((id) => id.id === otherId )
  let isFollowing = false
  if (!checkFollowing) {
    return isFollowing
  } else return isFollowing = true
}

const toggleFollowUser = async (req) => {
    const userCollection = database.db("Contendr").collection("users");
    const usernameToFollow = req.params.username;
    const userToFollow = await userModel.findByUsername(usernameToFollow);
      let check = await checkFollowing(req.user.following, userToFollow.id)
      const userId = req.user.id;
      if (!check) {
        await userCollection.updateOne(
          { id: userId },
          { $push: { following: { id: userToFollow.id } } }
        );
        await userCollection.updateOne(
          { id: userToFollow.id },
          { $push: { followers: { id: userId } } }
        );
      } else {
        await userCollection.updateOne(
          { id: userId },
          { $pull: { following: { id: userToFollow.id }}}
        )
        await userCollection.updateOne(
          { id: userToFollow.id},
          { $pull: { followers: { id: userId }}}
        )
      }
}

function isUserValid(user, password) {
  const passHash = userModel.hashPassword(password, user.password_salt);
  return user.password_hash === passHash;
}

async function findOrCreate(profile) {

  //will first find if user is in DB, and if not then user will be added to DB

  let user = await userModel.findById(parseInt(profile.id));
  if (user) {
    return user;
  } else {
    const userCollection = database.db("Contendr").collection("users");
    if (!profile.displayName) {
      let splitEmail = profile.emails[0].value.split("@");
      let username = splitEmail[0];
      await userCollection.insertOne({
        id: parseInt(profile.id),
        email: profile.emails[0].value,
        username: username,
        posts: [],
        following: [],
        followers: [],
        pending: 0,
      });
    } else {
      let usernameSplit = profile.displayName.split(" ");
      let newUsername = usernameSplit.join("");
      await userCollection.insertOne({
        id: parseInt(profile.id),
        email: profile.emails[0].value,
        username: newUsername,
        posts: [],
        following: [],
        followers: [],
        pending: 0,
      });
    }
    user = await userModel.findById(parseInt(profile.id)); //this will find user again after they have been added to DB
    return user;
  }
}

async function registerUser(req, res) {
  let user;
  try {
    user = await userModel.findOne(req.body.email);
  } catch {
    user = null;
  }
  if (user) {
    return new Error(`User with email ${user.email} already exists.`);
  } else {
    try {
      const schema = await Joi.object({
        email: Joi.string().min(5).max(40).required(),
        password: Joi.string().pattern(
          new RegExp('^[a-zA-Z0-9!@#$&()\\-`.+,/"]{6,30}$')
        ),
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

      const passSalt = password_salt.digest("hex");

      const passHash = userModel.hashPassword(req.body.password, passSalt);

      const userCollection = database.db("Contendr").collection("users");

      await userCollection.insertOne({
        id: uuidv4(),
        email: req.body.email,
        username: req.body.username,
        password_salt: passSalt,
        password_hash: passHash,
        posts: [],
        following: [],
        followers: [],
        pending: 0,
      });
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
  getFollowingUsernames,
  findUsernames,
  getUserByUsername,
  toggleFollowUser,
  checkFollowing,
  getList
};
