// const  = require('../models/products')
const express = require("express");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const Category = require("../models/category");
const routes = new express.Router();
routes.get("/", async (req, res) => {
  const result = await Category.find();

  if (!result) return res.status(404).send("error getting category");

  res.send(result);
});

routes.get("/:id", async (req, res) => {
  const result = await Category.findById(req.params.id);

  if (!result) return res.status(404).send("error getting category");

  res.send(result);
});

routes.post("/",[auth,admin], async (req, res) => {
  let category = new Category({
    name: req.body.name,
  });

  let result = await category.save();

  if (!result) return res.status(404).send("the category cannot be created");

  res.send(result);
});
routes.put("/:id",[auth,admin], async (req, res) => {
  let category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );
  if (!category) return res.status(404).send("the category cannot be updated");

  res.send(category);
});
routes.delete("/:id",[auth,admin], async (req, res) => {
  try {
    const result = await Category.findByIdAndRemove(req.params.id);

    if (result)
      return res.status(200).send({
        success: true,
        message: "deleted successfull",
      });
    else
      return res.status(404).send({
        success: false,
        message: "not found",
      });
  } catch (err) {
    res.send({
      success: false,
      message: err,
    });
  }
});

module.exports = routes;
