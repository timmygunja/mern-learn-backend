const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const User = require("../models/user");
const Product = require("../models/product");

let user;
let product;

const getFavsList = async (req, res, next) => {
  const username = decodeURIComponent(escape(req.headers.username));

  try {
    user = await User.findOne({ username: username }).populate("favorites");
  } catch (error) {
    return next(new HttpError("Could not find user favorites object", 500));
  }

  res.status(200).json({
    favItems: user.favorites.map((item) => item.toObject({ getters: true })),
  });
};

const getFavsIdsList = async (req, res, next) => {
  const username = decodeURIComponent(escape(req.headers.username));

  console.log(username);

  let favItemsIds = [];

  try {
    user = await User.findOne({ username: username }).populate("favorites");
  } catch (error) {
    return next(new HttpError("Could not find user favorites object", 500));
  }

  user.favorites.map((item) => {
    favItemsIds.push(item.id);
  });

  res.status(200).json({
    favItemsIds: favItemsIds,
  });
};

const addToFavs = async (req, res, next) => {
  const productId = req.params.pid;
  const username = decodeURIComponent(escape(req.headers.username));

  try {
    user = await User.findOne({ username: username }).populate("favorites");
    product = await Product.findById(productId);

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.save({ session: sess });
    user.favorites.push(product);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not add product to favorites", 500));
  }

  res.status(200).json({
    message: "Added to favorites",
  });
};

const deleteFromFavs = async (req, res, next) => {
  const productId = req.params.pid;
  const username = decodeURIComponent(escape(req.headers.username));

  try {
    user = await User.findOne({ username: username }).populate("favorites");
    user.favorites.pull(productId);
    await user.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not delete product from favorites", 500));
  }

  res.status(200).json({
    message: "Deleted product from favorites successfully",
  });
};

module.exports.getFavsList = getFavsList;
module.exports.getFavsIdsList = getFavsIdsList;
module.exports.addToFavs = addToFavs;
module.exports.deleteFromFavs = deleteFromFavs;
