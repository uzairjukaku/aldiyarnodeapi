const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv/config");
const morgan = require("morgan");
const cors = require("cors");
const authJwt = require("./helpers/jwt");

// routes
const productRoute = require("./routes/products");
const orderRoute = require("./routes/orders");
const userRoute = require("./routes/users");
const categoryRoute = require("./routes/category");
const whishlistRoute = require("./routes/whishlist");

// express server
const app = express();
const port = 3000;

// DB connections
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => console.log("connected"))
  .catch((err) => console.log("fail", err));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
// app.use(authJwt());
app.use((err, req, res, next) => {
  console.log("====================================");
  //  console.log(err);
  console.log("====================================");
  if (err) {
    res.status(500).json({ message: err });
  }
});
app.use(cors());
app.options("*", cors());

// routes for apis
app.use("/product", productRoute);
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/orders", orderRoute);
app.use("/whishlist", whishlistRoute);
// server

app.listen(port, () => {
  console.log("app is running on" + port);
});
