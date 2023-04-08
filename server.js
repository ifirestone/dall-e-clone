require("dotenv").config();

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const multer = require("multer");
let filePath;

const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage");
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
  },
});
const upload = multer({ storage: storage }).single("file");

app.post("/images", async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: req.body.message,
      n: 6,
      size: "1024x1024",
    });
    res.send(response.data.data);
  } catch (error) {
    console.error(error);
  }
});

app.post("/upload", async (req, res) => {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      console.error(error);
      return res.status(500).json(error);
    } else if (error) {
      console.error(error);
      return res.status(500).json(error);
    }
    filePath = req.file.path;
    console.log(filePath);
  });
});

app.post("/variations", async (req, res) => {
  try {
    const response = await openai.createImageVariation(
      fs.createReadStream(filePath),
      6,
      "1024x1024"
    );
    res.send(response.data.data);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => console.log("Your server is running on PORT " + PORT));
