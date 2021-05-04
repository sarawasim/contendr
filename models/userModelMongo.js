// const { database } = require("../fakeDB");
const database = include("databaseConnection/databaseConnection");

const userModel = {
  findByUsername: async (username) => {
    const userCollection = database.db("Contendr").collection("users");
    const users = await userCollection
      .find()
      .project({
        id: 1,
        email: 1,
        username: 1,
        posts: 1,
        following: 1,
        password: 1,
      })
      .toArray();
    console.log("user model users-------------- " + JSON.stringify(users));
    const user = users.find((user) => user.username === username);
    if (user) {
      console.log("the user is ---------------------- " + JSON.stringify(user));

      return user;
    }
    throw new Error(`Couldn't find user with username: ${username}`);
  },
  findOne: async (email) => {
    const userCollection = database.db("Contendr").collection("users");
    const users = await userCollection
      .find()
      .project({
        id: 1,
        email: 1,
        username: 1,
        posts: 1,
        following: 1,
        password: 1,
      })
      .toArray();
    console.log("user model users-------------- " + JSON.stringify(users));
    const user = users.find((user) => user.email === email);
    if (user) {
      console.log("the user is ---------------------- " + JSON.stringify(user));

      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: async (id) => {
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
    console.log("user model users-------------- " + JSON.stringify(users));
    const user = users.find((user) => user.id === id);
    if (user) {
      console.log("the user is ---------------------- " + JSON.stringify(user));
      return user;
    }
    console.log(`Couldn't find user with id: ${id}`);
    return null;
    // throw new Error(`Couldn't find user with id: ${id}`);
  },
};

module.exports = { userModel };
