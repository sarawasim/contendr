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
  res.render("login");
  res.redirect("/auth/login");
});

router.post("/register", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

// router.get("/revoke/:sessionID", (req, res) => {
//   //grabs sessionID passed from URL param from clicking revoke <a> tag
//   const sessionID = req.params.sessionID;
//   // console.log("session ID is ----------------" + sessionID);
//   delete req.sessionStore.sessions[sessionID]; // clicking revoke <a> tag in admin-dashboard will delete the session from sessionStore
//   res.redirect("/admin-dashboard");
// });

module.exports = router;
