require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/index.js");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", routes);

const PORT = process.env.PORT;

mongoose.connect(
  process.env.connection_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      throw err;
    }
    console.log("MongoDB connected successfully !");
  }
);

app.listen(PORT, () => console.log(`Server run successfully on port ${PORT}`));
