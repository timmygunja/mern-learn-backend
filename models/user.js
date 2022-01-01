const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 3 },
  cart: [{ type: mongoose.Types.ObjectId, ref: "Product", required: true }],
  cartQuantity: { type: Number, required: true},
  cartTotalPrice: { type: Number, required: true},
  favorites: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
