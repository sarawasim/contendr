const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");
const { json } = require("express");
const crypto = require("crypto");

const Joi = require("joi");
const { ObjectId } = require("bson");
const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/auth/login" }),
  function (req, res) {
    // console.log("req.user is ------------------------------------- " + req.user);

    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

router.post(
  //add github strat
  //github login route
  "/github",
  passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/login" }), //prompt to add new user to database
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

const passwordPepper = "S3cr3+oD3lCli3nt3";

router.post("/register", async (req, res) => {
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

    password_salt.update(uuid());

    const password_hash = crypto.createHash("sha512");

    password_hash.update(req.body.password + passwordPepper + password_salt);

    const userCollection = database.db("lab_example").collection("users");
    await userCollection.insertOne({
      email: req.body.email,
      username: req.body.username,
      password_salt: password_salt.digest("hex"),
      password_hash: password_hash.digest("hex"),
    });
    res.redirect("/auth/login");
  } catch (ex) {
    res.render("error", { message: "Error connecting to Mongo" });
    console.log("Error connecting to Mongo");
    console.log(ex);
  }
});

// router.get("/revoke/:sessionID", (req, res) => {
//   //grabs sessionID passed from URL param from clicking revoke <a> tag
//   const sessionID = req.params.sessionID;
//   // console.log("session ID is ----------------" + sessionID);
//   delete req.sessionStore.sessions[sessionID]; // clicking revoke <a> tag in admin-dashboard will delete the session from sessionStore
//   res.redirect("/admin-dashboard");
// });

module.exports = router;
