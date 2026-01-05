const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const userAuth = require("./routes/index.routes");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", userAuth);

app.use((req, res) => res.status(404).send("404 Not Found"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}...`)
);
