const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./db/db.js");
const userRoutes = require("./routes/user.routes.js");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/users', userRoutes);

module.exports = app;

