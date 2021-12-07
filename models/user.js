const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  favItems: [{ type: mongoose.Types.ObjectId, ref: "Product", required: true }],
  cartItems: [{ type: mongoose.Types.ObjectId, ref: "Product", required: true }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
