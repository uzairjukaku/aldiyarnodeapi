const mongoose = require("mongoose");

const userTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
   
  },
});

const userType = mongoose.model("UserType", userTypeSchema);
module.exports = userType;
