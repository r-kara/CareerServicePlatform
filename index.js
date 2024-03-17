const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handling");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/api");
require("dotenv").config();


const app = express();


const port = process.env.PORT;

app.get("/", (req, res) => {
  res.end("Welcome!");
});

//Connecting to database
mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.use("/api", routes);

app.use(errorHandlerMiddleware);

if (process.env.NODE_ENV !== "test") {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(
      process.env.DB
    )
    .then(() =>
      app.listen(process.env.PORT, () => {
        console.log(`Server listening on ${process.env.PORT}`);
      })
    )
    .catch((err) => console.log("Could not connect to the database"));
}


module.exports = app;