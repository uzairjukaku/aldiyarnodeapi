// const  = require('../models/products')
const express = require("express");
const User = require("../models/users");
const userType = require("../models/usertypes");
const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");

const routes = new express.Router();

routes.get("/usertype", async (req, res) => {
  let usertype = await userType.find();
  if (!usertype) return res.status(404).send("error getting usertype");

  res.send(usertype);
});

routes.post("/usertype",[auth,admin], async (req, res) => {
  const usertype = new userType({
    type: req.body.type,
  });

  let result = await usertype.save();

  if (!result) return res.status(404).send("the usertype is cannot  created");

  res.send(result);
});

routes.get("/", async (req, res) => {
  let users = await User.find().populate("userType");
  if (!users) return res.status(404).send("error getting users");
  res.send(users);
});
routes.get("/:id", async (req, res) => {
  let user = await User.findById(req.params.id)
    .populate("userType")
    .select("-passwordHash");
  if (!user) return res.status(404).send("error getting user");

  res.send(user);
});

routes.post("/",[auth,admin], async (req, res) => {
  let userdata = await User.findOne({ email: req.body.email });
  if (userdata) return res.status(404).send("user with email already exist");

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bycrypt.hashSync(req.body.passwordHash, 10),
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    userType: req.body.userType,
  });

  let result = await user.save();
  if (!result) return res.status(404).send("the user is cannot be created");

  res.send(result);
});

routes.put("/:id",[auth,admin], async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    console.log("====================================");
    console.log(mongoose.isValidObjectId(req.params.id));
    console.log("====================================+" + req.params.id);
    return res.status(400).send("invalid productId");
  }

  let usertype = await userType.findById(req.body.userType);

  if (!usertype) return res.status(400).send("invalid userType");
  let user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: req.body.passwordHash,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      userType: req.body.userType,
    },
    {
      new: true,
    }
  );
  if (!user) return res.status(404).send("the user cannot be updated");

  res.send(user);
});
routes.delete("/:id",[auth,admin], (req, res) => {
  res.send("user");
});

routes.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).populate(
    "userType"
  );
  const secret = process.env.secret;
  if (!user) return res.status(400).send("The user not found");

  if (user && bycrypt.compareSync(req.body.password, user.passwordHash)) {
    console.log("====================================");
    console.log(user);
    console.log("====================================");
    const token = jwt.sign(
      {
        userId: user._id,
        userName:user.name,
        userType: user.userType.type,
      },
      secret
      // { expiresIn: "1d" }
    );

    res.send({ email: user.email, token: token });
  } else {
    res.status(400).send("password is wrong");
  }
});

module.exports = routes;
