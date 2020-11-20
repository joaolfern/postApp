const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

//bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

  app.use(cors());


//import routes
const postsRoute = require("./routes/posts");
app.use("/posts", postsRoute);

//routes
app.get("/", (req, res) => {
  res.send("hi");
});

//Connect
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => console.log("db connected")
);

app.listen(3000);
