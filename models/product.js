const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const defaultPath = "uploads/images/defaultProduct.png";

const productSchema = new Schema({
  name: { type: String, required: true },
  firm: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  image: { type: String, required: false, default: defaultPath }, // url to image
  image2: { type: String, required: false, default: defaultPath },
  image3: { type: String, required: false, default: defaultPath },
  image4: { type: String, required: false, default: defaultPath },
  viewedCount: { type: Number, required: true },
  likedCount: { type: Number, required: true },
  purchasedCount: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
