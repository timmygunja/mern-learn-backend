const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const User = require("../models/user");
const Product = require("../models/product");
const CartItem = require("../models/cartItem");

let user;
let product;
let cartItems;

// converting cart to proper cartItems
// const getCartItems = async (cart) => {
//   cartItems = [];

//   cart.map(async (item) => {
//     productId = item.product;
//     product = await Product.findById(productId);
//     cartItems.push({ product: product, quantity: item.quantity });
//   });

//   console.log("---------------");
//   console.log(cartItems);
//   console.log("---------------");

//   return cartItems;
// };

const getCartList = async (req, res, next) => {
  const username = req.headers.username;

  try {
    user = await User.findOne({ username: username }).populate("cart");
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not find user cart object", 500));
  }

  if (user.cart.length === 0) {
    return res.status(200).json({
      cartItems: [],
    });
  }

  try {
    cartItems = await Product.populate(user.cart, { path: "product" });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not find cart item objects", 500));
  }

  res.status(200).json({
    cartItems: cartItems.map((item) => item.toObject({ getters: true })),
    cartTotalPrice: user.cartTotalPrice,
  });
};

const getCartLength = async (req, res, next) => {
  const username = req.headers.username;

  try {
    user = await User.findOne({ username: username }).populate("cart");
  } catch (error) {
    return next(new HttpError("Could not find user cart object", 500));
  }

  res.status(200).json({
    cartLength: user.cart.length,
  });
};

// const addToCart = async (req, res, next) => {
//   const productId = req.params.pid;
//   const username = req.headers.username;

//   try {
//     user = await User.findOne({ username: username }).populate("cart");
//     product = await Product.findById(productId);

//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     await product.save({ session: sess });
//     user.cart.push(product);
//     // user.cart.items.push(product);
//     await user.save({ session: sess });
//     await sess.commitTransaction();
//   } catch (error) {
//     console.log(error);
//     return next(new HttpError("Could not add product to cart", 500));
//   }

//   res.status(200).json({
//     message: "Added to cart",
//   });
// };

const addToCart = async (req, res, next) => {
  const productId = req.params.pid;
  const username = req.headers.username;

  try {
    user = await User.findOne({ username: username }).populate("cart");
    product = await Product.findById(productId);

    const createdCartItem = new CartItem({
      product: product,
      quantity: 1,
    });

    // try {
    //   await createdCartItem.save();
    // } catch (err) {
    //   return next(new HttpError("Could not save the cart item object", 500));
    // }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdCartItem.save({ session: sess });
    user.cart.push(createdCartItem);
    user.cartTotalPrice += product.price;
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not add cart item to cart", 500));
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
    user.cartTotalPrice -= product.price;
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
module.exports.getCartLength = getCartLength;
module.exports.addToCart = addToCart;
module.exports.deleteFromCart = deleteFromCart;
