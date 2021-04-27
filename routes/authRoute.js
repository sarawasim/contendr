const express = require("express");
// const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");
const { json } = require("express");

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

router.post(
  "/login"
  // passport.authenticate("local", { failureRedirect: "/auth/login" }),
  // function (req, res) {
  //   // console.log("req.user is ------------------------------------- " + req.user);
  //   if (req.user.isAdmin === true) {
  //     res.redirect("/admin-dashboard"); //if req.user has a property of isAdmin that is set to true, then redirects to admin dashboard
  //   } else {
  //     // Successful authentication, redirect home.
  //     res.redirect("/dashboard");
  //   }
  // }
);

// router.post(
//   //add github strat
//   //github login route
//   "/github",
//   passport.authenticate("github", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/auth/login",
//   })
// );

// router.get(
//   "/github/callback",
//   passport.authenticate("github", { failureRedirect: "/auth/login" }), //prompt to add new user to database
//   function (req, res) {
//     if (req.user.isAdmin === true) {
//       //if req.user has a property of isAdmin that is set to true, then redirects to admin dashboard
//       res.redirect("/admin-dashboard");
//     } else {
//       // Successful authentication, redirect home.
//       res.redirect("/dashboard");
//     }
//   }
// );

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

router.get("/revoke/:sessionID", (req, res) => {
  //grabs sessionID passed from URL param from clicking revoke <a> tag
  const sessionID = req.params.sessionID;
  // console.log("session ID is ----------------" + sessionID);
  delete req.sessionStore.sessions[sessionID]; // clicking revoke <a> tag in admin-dashboard will delete the session from sessionStore
  res.redirect("/admin-dashboard");
});

module.exports = router;
