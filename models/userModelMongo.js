// const { database } = require("../fakeDB");
const database = include("databaseConnection/databaseConnection");

const passwordPepper = "S3cr3+oD3lCli3nt3";
const crypto = require("crypto");

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
  searchUsernames: async (input) => {
    const userCollection = database.db("Contendr").collection("users");
    const results = await userCollection
      .find({"username" : {$regex : `.*${input}.*`}})
      .project({
        username: 1,
        following: 1,
        posts: 1,
      })
      .toArray();
    if (results) {
      console.log("the search results are ---------------------- " + JSON.stringify(results));

      return results;
    }
    throw new Error(`Couldn't find any users with username: ${input}`);
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
        password_salt: 1,
        password_hash: 1,
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

  hashPassword: (password, salt) => {
    console.log("HASHPASS()");
    console.log("HASHPASS()");

    const password_hash = crypto.createHash("sha512");
    console.log("PASSWORD ============ " + password);
    console.log("PASSWORD PEPPER ============ " + passwordPepper);

    password_hash.update(password + passwordPepper + salt);
    console.log("hash pass PASSWORD SALT ============ " + salt);
    console.log("HASHPASS()");
    console.log("HASHPASS()");

    return password_hash.digest("hex");
  },
};

module.exports = { userModel };
