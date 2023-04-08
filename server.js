require("dotenv").config();

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log("Your server is running on PORT " + PORT));
