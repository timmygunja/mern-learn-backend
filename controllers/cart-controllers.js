const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const User = require("../models/user");
const Product = require("../models/product");

let user;
let product;
let cartItems;

const getCartList = async (req, res, next) => {
  const username = req.headers.username;

  try {
    user = await User.findOne({ username: username }).populate("cart");
  } catch (error) {
    return next(new HttpError("Could not find user cart object", 500));
  }

  res.status(200).json({
    cartItems: user.cart.map((item) => item.toObject({ getters: true })),
  });
};

const addToCart = async (req, res, next) => {
  const productId = req.params.pid;
  const username = req.headers.username;

  try {
    user = await User.findOne({ username: username }).populate("cart");
    product = await Product.findById(productId);

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.save({ session: sess });
    user.cart.push(product);
    // user.cart.items.push(product);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not add product to cart", 500));
  }

  res.status(200).json({
    message: "Added to cart",
  });
};

const deleteFromCart = async (req, res, next) => {
  const productId = req.params.pid;
  const username = req.headers.username;

  try {
    user = await User.findOne({ username: username }).populate("cart");
    user.cart.pull(productId);
    await user.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not delete product from cart", 500));
  }

  res.status(200).json({
    message: "Deleted product from cart successfully",
  });
};

module.exports.getCartList = getCartList;
module.exports.addToCart = addToCart;
module.exports.deleteFromCart = deleteFromCart;
