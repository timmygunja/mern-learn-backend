const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const favoriteItemSchema = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
});

module.exports = mongoose.model("FavoriteItem", favoriteItemSchema);
