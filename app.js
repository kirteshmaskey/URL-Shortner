const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:8000/";
const DB = process.env.DATABASE;

// connect to MongoDB
mongoose
  .connect(DB)
  .then(() => console.log("Connected to Database"))
  .catch((err) => {
    console.log("Unable to connect to Database");
    console.log(err);
  });

// create URL schema
const urlSchema = new mongoose.Schema({
  originalURL: String,
  shortURL: String,
});

// create URL model
const URL = mongoose.model("URL", urlSchema);

const generateRandomString = () => {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

app.post("/api/shorten", async (req, res) => {
  const { url } = req.body;
  // generate short URL
  const shortURL = BASE_URL + generateRandomString();
  // save original and short URLs to database
  await URL.create({ originalURL: url, shortURL });
  res.json({ shortURL });
});

app.get("/:shortURL", async (req, res) => {
  const { shortURL } = req.params;
  // find original URL from database
  const url = await URL.findOne({ shortURL: `${BASE_URL}${shortURL}` });
  if (url) {
    // redirect to original URL
    res.redirect(url.originalURL);
  } else {
    res.status(404).send("Not found");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
