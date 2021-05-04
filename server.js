//Define the include function for absolute file name
global.base_dir = __dirname;
global.abs_path = function (path) {
  return base_dir + path;
};
global.include = function (file) {
  return require(abs_path("/" + file));
};

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");
const port = process.env.PORT || 8080;
const dotenv = require("dotenv").config();
const { generateUploadURL } = require("./models/s3model");

const app = express();

const database = include("databaseConnection/databaseConnection");
// establish connection to Mongo Atlas db
database.connect((err, dbConnection) => {
  if (!err) {
    console.log("Successfully connected to MongoDB");
  } else {
    console.log("Error Connecting to MongoDB");
    console.log(err);
  }
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
// creates session cookie for client
app.use(
  session({
    secret: "secretSauce1234!",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const passport = require("./middleware/passport");
const authRoute = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");

// Middleware for express
app.use(express.json());
app.use(expressLayouts);

// layouts for ejs
app.set("layout auth/login", false);
app.get("/auth/login", (req, res) => {
  res.render("login", { layout: "login" });
});
app.set("layout auth/register", false);
app.get("/auth/register", (req, res) => {
  res.render("register", { layout: "register" });
});

app.set("layout createChallenge", false);
app.get("/createChallenge", (req, res) => {
  res.render("createChallenge", { layout: "layoutB" });
});

// gets upload url for s3 bucket. This is used in scripts/upload.js
app.get("/s3url", async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

app.use(express.urlencoded({ extended: true }));
// init passport strats
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);
  next();
});

app.use("/", indexRoute);
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
