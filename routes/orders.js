// const  = require('../models/products')
const express = require("express");
const OrderItem = require("../models/orderitem");
const Order = require("../models/orders");

const routes = new express.Router();
routes.get("/", async (req, res) => {
  let orderList = await Order.find()
    .populate("user", { passwordHash: 0, userType: 0 })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: { path: "categories" } },
    });
  if (!orderList) {
    res.status(500).json({ success: false });
  }

  res.send(orderList);
});

routes.post("/", async (req, res) => {
  const orderitems = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const orderitemsidResolved = await orderitems;

  const totalPrices = await Promise.all(
    orderitemsidResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  let order = new Order({
    orderItems: orderitemsidResolved,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  let result = await order.save();
  if (!result) return res.status(404).send("the order is not valid");
  res.send(result);
});

routes.put("/:id", async (req, res) => {
  let order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  if (!order) return res.status(404).send("the order cannot be updated");

  res.send(order);
});
routes.delete("/:id", async (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

routes.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  if (!totalSales)
    return res
      .status(404)
      .json({ success: false, message: "dale status cannot be generated!" });
  res.send({
    totalSales: totalSales,
  });
});

routes.get("/count", async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count);

  if (!orderCount)
    return res
      .status(404)
      .json({ success: false, message: "orderCount cannot be generated!" });
  res.send({ orderCount: orderCount });
});

routes.get("/userorder/:userid", async (req, res) => {
    let orderList = await Order.find({user:req.params.userid})
 
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: { path: "categories" } },
    });
  if (!orderList) {
    res.status(500).json({ success: false });
  }

  res.send(orderList);
  });

module.exports = routes;
