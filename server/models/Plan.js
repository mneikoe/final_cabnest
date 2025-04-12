const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rides: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
