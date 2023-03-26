// import mongoose from 'mongoose'
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  detailDescription: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  images: [
    {
      type: String,
    },
  ],

  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
  },
  thresholdStock: {
    type: Number,
  },
  isOffer: {
    type: Boolean,
    default: false,
  },
  offerPrice: {
    type: Number,
  },
  dateCreateed: {
    type: Date,
    default: Date.now,
  },

  // Category
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
