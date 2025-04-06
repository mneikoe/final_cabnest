const mongoose = require("mongoose");
const slotSchema = new mongoose.Schema({
  location: String,
  time: String,
  direction: { type: String, enum: ["to_college", "from_college"] },
  date: Date,
  capacity: { type: Number, default: 11 },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
module.exports = mongoose.model("Slot", slotSchema);
