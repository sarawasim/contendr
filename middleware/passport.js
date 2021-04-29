const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controllers/userControllerMongo");
const GitHubStrategy = require("Passport-GitHub2").Strategy;
require("dotenv").config();

const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    const user = await userController.getUserByEmailIdAndPassword(
      email,
      password
    );
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);
// let userProfile;
const githubLogin = new GitHubStrategy(
  {
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:8080/auth/github/callback",
    scope: ["user:email"],
  },
  async function (accessToken, refreshToken, profile, done) {
    // console.log(
    //   "the profile is ---------------------------- " + JSON.stringify(profile));
    const user = await userController.findOrCreate(profile);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Somethin' went wrong, ehyy!",
        });
  }
);

passport.serializeUser(async function (user, done) {
  console.log("useeerrrrrrrrrrrrrrrr serial " + user);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin);
module.exports = passport.use(githubLogin);
