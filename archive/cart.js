const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    items: [{ type: mongoose.Types.ObjectId, ref: "CartItem", required: true }],
    totalCount: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Cart", cartSchema);
