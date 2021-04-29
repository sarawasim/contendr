const MongoClient = require("mongodb").MongoClient;
const is_heroku = process.env.IS_HEROKU || false;
const herokuURI =
  "mongodb+srv://theMongoAdmin:accidentalLoginSteps@cluster0.n1i6g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const localURI =
  "mongodb://localhost/?authSource=admin&retryWrites=true&w=majority";
if (is_heroku) {
  var database = new MongoClient(herokuURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} else {
  var database = new MongoClient(localURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = database;
