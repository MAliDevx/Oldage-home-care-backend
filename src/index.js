const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const userAuth = require("./routes/index.routes");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path")
const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Your Learning APP API is up and running!');
});

// app.use("/uploads", express.static("uploads"));
app.use('/public/', express.static(path.join(__dirname, '../uploads')));

app.use("/api", userAuth);

app.use((req, res) => res.status(404).send("404 Not Found"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}...`)
);