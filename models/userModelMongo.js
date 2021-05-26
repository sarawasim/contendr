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
        followers: 1,
        pending: 1,
      })
      .toArray();
    const user = users.find((user) => user.username === username);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with username: ${username}`);
  },
  searchUsernames: async (input) => {
    const userCollection = database.db("Contendr").collection("users");
    const results = await userCollection
      .find({ username: { $regex: `.*${input}.*`, $options: "i" } })
      .project({
        username: 1,
        following: 1,
        followers: 1,
        posts: 1,
        pending: 1,
      })
      .toArray();
    if (results) {
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
        followers: 1,
        password: 1,
        password_salt: 1,
        password_hash: 1,
        pending: 1,
      })
      .toArray();
    const user = users.find((user) => user.email === email);
    if (user) {
      return user;
    }
    // return new Error(`Couldn't find user with email: ${email}`);
    return null;
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
        followers: 1,
        pending: 1,
      })
      .toArray();
    const user = users.find((user) => user.id === id);
    if (user) {
      return user;
    }
    return new Error(`Couldn't find user with id: ${id}`);
    // throw new Error(`Couldn't find user with id: ${id}`);
  },

  hashPassword: (password, salt) => {
    const password_hash = crypto.createHash("sha512");
    password_hash.update(password + passwordPepper + salt);
    return password_hash.digest("hex");
  },
};

module.exports = { userModel };
