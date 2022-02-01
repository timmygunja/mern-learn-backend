const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
//   cart,
});

module.exports = mongoose.model("CartItem", cartItemSchema);