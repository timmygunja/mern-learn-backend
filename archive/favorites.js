const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const favoritesSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    items: [{ type: mongoose.Types.ObjectId, ref: "FavoriteItem", required: true }],
});

module.exports = mongoose.model("Favorites", favoritesSchema);
