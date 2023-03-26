const auth=require('../middleware/auth')

const Product = require("../models/products");
const express = require("express");
const Category = require("../models/category");
const mongoose = require("mongoose");
const multer = require("multer");
const admin = require('../middleware/admin');

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = FILE_TYPE_MAP[file.mimetype];
    const fileName = file.originalname.replace(" ", "-");
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

const routes = new express.Router();
routes.get("/", async (req, res) => {
  let product = await Product.find().populate("categories");
  if (!product) return res.status(404).send("error getting product");

  res.send(product);
});
routes.get("/:id", async (req, res) => {
  let product = await Product.findById(req.params.id).populate("categories");
  if (!product) return res.status(404).send("error getting product");

  res.send(product);
});
routes.post("/",[auth,admin,uploadOptions.single("image")], async (req, res) => {
  const category = await Category.findById(req.body.categories);

  if (!category) return res.status(400).send("invalid category");

  const file = req.file;
  if (!file) return res.status(400).send("no file");
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    detailDescription: req.body.detailDescription,
    price: req.body.price,
    image: `${basePath}${fileName}`,
    images: req.body.images,
    categories: req.body.categories,
    countInStock: req.body.countInStock,
    thresholdStock: req.body.thresholdStock,
    isOffer: req.body.isOffer,
    offerPrice: req.body.offerPrice,
    dateCreateed: req.body.dateCreateed,
  });

  let result = await product.save();

  if (!result) return res.status(404).send("the product is cannot be created");
  res.send(result);
});

routes.put("/:id",[auth,admin], async (req, res) => {
  if (mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("invalid productId");
  }

  const category = await Category.findById(req.body.categories);

  if (!category) return res.status(400).send("invalid category");
  let product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      detailDescription: req.body.detailDescription,
      price: req.body.price,
      image: req.body.image,
      images: req.body.images,
      categories: req.body.categories,
      countInStock: req.body.countInStock,
      thresholdStock: req.body.thresholdStock,
      isOffer: req.body.isOffer,
      offerPrice: req.body.offerPrice,
      dateCreateed: req.body.dateCreateed,
    },
    {
      new: true,
    }
  );
  if (!product) return res.status(404).send("the product cannot be updated");

  res.send(product);
});
routes.delete("/:id",[auth,admin], (req, res) => {


  res.send("products");
});

module.exports = routes;
