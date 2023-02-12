const HttpError = require("../models/http-error");
const fs = require("fs");

const { validationResult } = require("express-validator");

const Product = require("../models/product");
const User = require("../models/user");

let products;

const getProductsList = async (req, res, next) => {
  try {
    products = await Product.find();
  } catch (error) {
    return next(new HttpError("Could not find any product", 500));
  }

  if (products.length === 0) {
    return res.json({ message: "There are no products in database" });
  }

  res.status(200).json({
    products: products.map((product) => product.toObject({ getters: true })),
  });
};

const getProductById = async (req, res, next) => {
  let product;
  const productId = req.params.pid;

  try {
    product = await Product.findById(productId);
  } catch (error) {
    return next(new HttpError("Could not find product", 500));
  }

  if (!product) {
    return next(new HttpError("Product not found", 404));
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const createProduct = async (req, res, next) => {
  const username = req.headers.username;
  const admin = User.findOne({ username: "admin" });
  if (username !== admin.username) {
    return next(new HttpError("You have no rights to this page", 401));
  }

  console.log("flag 1");

  const errors = validationResult(req);

  console.log("flag 2");

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid info given", 401));
  }

  console.log("flag 3");

  const { name, firm, description, price } = req.body;

  console.log("flag 4");
  console.log(name, firm, description, price);

  const createdProduct = new Product({
    name,
    firm,
    description,
    price,
    image: req.file.path,
  });

  console.log("flag 5");

  try {
    await createdProduct.save();
    console.log("flag 6");
  } catch (err) {
    console.log("flag 6 FAILED");
    return next(new HttpError("Could not save the product object", 500));
  }

  console.log("flag 7");

  res.status(201).json({ createdProduct });
};

const updateProduct = async (req, res, next) => {
  let product;
  const productId = req.params.pid;
  const { name, firm, description, price, image } = req.body;

  try {
    product = await Product.findById(productId);
  } catch (err) {
    return next(new HttpError("Could not find the product object", 500));
  }

  product.name = name;
  product.firm = firm;
  product.description = description;
  product.price = price;
  product.image = image;

  try {
    await product.save();
  } catch (err) {
    return next(new HttpError("Could not save the product object", 500));
  }

  res.status(200).json({ product: product.toObject({ getters: true }) });
};

const deleteProduct = async (req, res, next) => {
  let product;
  const productId = req.params.pid;

  try {
    product = await Product.findById(productId);
  } catch (err) {
    return next(new HttpError("Could not find the product object", 500));
  }

  try {
    await product.delete();
  } catch (err) {
    return next(new HttpError("Could not delete the product object", 500));
  }

  const imagePath = product.image;
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted product successfully" });
};

module.exports.getProductsList = getProductsList;
module.exports.getProductById = getProductById;
module.exports.createProduct = createProduct;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;
