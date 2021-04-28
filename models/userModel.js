const { database } = require("../fakeDB");

const userModel = {
  findOne: (email) => {
    const user = database.users.find((user) => user.email === email);
    // console.log("the email is ---------------------- " + email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id) => {
    const user = database.users.find((user) => user.id === id);
    if (user) {
      return user;
    }
    console.log(`Couldn't find user with id: ${id}`);
    return null;
    // throw new Error(`Couldn't find user with id: ${id}`);
  },
};

module.exports = { userModel };
