const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const User = require("../models/user");
const Product = require("../models/product");

let user;
let product;
let cartItems;

const getCartList = async (req, res, next) => {
  try {
    userWithCart = await User.findOne({ username: "user" }).populate("cart");
  } catch (error) {
    return next(new HttpError("Could not find any cart items", 500));
  }

  res.status(200).json({
    cartItems: userWithCart.cart.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};

const addToCart = async (req, res, next) => {
  const productId = req.params.pid;

  try {
    user = await User.findOne({ username: "user" }).populate("cart");
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
  // let product;
  // const productId = req.params.pid;
  // try {
  //   product = await Product.findById(productId);
  // } catch (err) {
  //   return next(new HttpError("Could not find the product object", 500));
  // }
  // try {
  //   await product.delete();
  // } catch (err) {
  //   return next(new HttpError("Could not delete the product object", 500));
  // }
  // res.status(200).json({ message: "Deleted product successfully" });
};

module.exports.getCartList = getCartList;
module.exports.addToCart = addToCart;
module.exports.deleteFromCart = deleteFromCart;
