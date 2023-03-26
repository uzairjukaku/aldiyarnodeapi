const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  status: {
    type: String,
    default: "Pending",
    required: true,
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },

  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
