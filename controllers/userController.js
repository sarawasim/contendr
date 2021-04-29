const userModel = require("../models/userModelMongo").userModel;
// const userModel = require("../models/userModel").userModel;
// ^^ use this for fake db
const { database } = require("../fakeDB");

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
  return String(user.password) == password;
}

function findOrCreate(profile) {
  //will first find if user is in DB, and if not then user will be added to DB
  // console.log(
  //   "\nthe name of profile is --------- " + JSON.stringify(profile._json.name)
  // );
  let user = userModel.findById(parseInt(profile.id));
  if (user) {
    return user;
  } else {
    database.users.push({
      // if there is no user found in the DB, add user to DB then check again and return user
      id: parseInt(profile.id),
      email: profile.emails[0].value,
      username: profile.displayName,
      Posts: [],
      following: [],
    });
    user = userModel.findById(parseInt(profile.id)); //this will find user again after they have been added to DB
    return user;
  }
}

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
  findOrCreate,
};
