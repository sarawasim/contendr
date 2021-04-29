const userModel = require("../models/userModelMongo").userModel;
const database = include("databaseConnection/databaseConnection");

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

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
  findOrCreate,
};
