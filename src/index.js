const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const userAuth = require("./routes/index.routes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.resolve("src/uploads"))
);


app.get("/", (req, res) => {
  res.send("Your Learning APP API is up and running!");
});

app.use("/api", userAuth);

app.use((req, res) => res.status(404).send("404 Not Found"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);