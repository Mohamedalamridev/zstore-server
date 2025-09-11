const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.DB_URI).then(() => {
  console.log("connected");
});

const ProductRouter = require("./Routes/ProductRoute");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server run on port", port);
});

app.use("/api/product", ProductRouter);
