const HttpError = require("../models/http-error");

const Product = require("../models/product");

let products;

const getFavsList = async (req, res, next) => {
  // try {
  //   products = await Product.find();
  // } catch (error) {
  //   return next(new HttpError("Could not find any product", 500));
  // }

  // if (products.length === 0) {
  //   return res.json({ message: "There are no products in database" });
  // }

  // res.status(200).json({ products });
};

const addToFavs = async (req, res, next) => {
  // const { name, description, price } = req.body;

  // const createdProduct = new Product({
  //   name,
  //   description,
  //   price,
  //   image: "asd",
  // });

  // try {
  //   await createdProduct.save();
  // } catch (err) {
  //   return next(new HttpError("Could not save the product object", 500));
  // }

  // res.status(201).json({ createdProduct });
};

const deleteFromFavs = async (req, res, next) => {
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

module.exports.getFavsList = getFavsList;
module.exports.addToFavs = addToFavs;
module.exports.deleteFromFavs = deleteFromFavs;
