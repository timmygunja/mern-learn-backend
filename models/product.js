const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  firm: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  image: { type: String, required: false, default: "" }, // url to image
  viewedCount: { type: Number, required: true },
  likedCount: { type: Number, required: true },
  purchasedCount: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
