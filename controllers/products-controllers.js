const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");

const Product = require("../models/product");

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

  res.status(200).json({ products });
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid info given", 401));
  }

  const { name, description, price } = req.body;

  const createdProduct = new Product({
    name,
    description,
    price,
    image: "asd",
  });

  try {
    await createdProduct.save();
  } catch (err) {
    return next(new HttpError("Could not save the product object", 500));
  }

  res.status(201).json({ createdProduct });
};

const updateProduct = async (req, res, next) => {
  let product;
  const productId = req.params.pid;
  const { name, description, price, image } = req.body;

  try {
    product = await Product.findById(productId);
  } catch (err) {
    return next(new HttpError("Could not find the product object", 500));
  }

  product.name = name;
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

  res.status(200).json({ message: "Deleted product successfully" });
};

module.exports.getProductsList = getProductsList;
module.exports.getProductById = getProductById;
module.exports.createProduct = createProduct;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;
