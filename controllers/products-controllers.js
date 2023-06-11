const HttpError = require("../models/http-error");
const fs = require("fs");

const { validationResult } = require("express-validator");

const Product = require("../models/product");
const User = require("../models/user");

let products;

const getProductsList = async (req, res, next) => {
  try {
    products = await Product.find(); // unfiltered find

    if (products.length === 0) {
      return res.json({ message: "There are no products in database" });
    }

    // filtered find
    if (req.headers.productfilter) {
      const filter = req.headers.productfilter.toLowerCase();
      if (filter === "popular") {
        products.sort((a, b) => (a.viewedCount > b.viewedCount ? -1 : 1));
      } else if (filter === "liked") {
        products.sort((a, b) => (a.likedCount > b.likedCount ? -1 : 1));
      } else if (filter === "bestseller") {
        products.sort((a, b) => (a.purchasedCount > b.purchasedCount ? -1 : 1));
      }
    }
  } catch (error) {
    return next(new HttpError("Could not find any product", 500));
  }

  // console.log(products);

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

  try {
    product.viewedCount += 1;
    await product.save();
  } catch (error) {
    return next(
      new HttpError("Could not add to viewCount of the product", 500)
    );
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const createProduct = async (req, res, next) => {
  const username = decodeURIComponent(escape(req.headers.username));
  const admin = await User.findOne({ username: "admin" });

  if (username !== admin.username) {
    return next(new HttpError("You have no rights to this page", 401));
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid info given", 401));
  }

  const { name, firm, description, price } = req.body;

  // console.log("REQUEST FILES:", req.files);

  let image;
  let image2;
  let image3;
  let image4;

  // for (let n = 0; n < 4; n++) {
  //   req.files[n] !== undefined ? (images[n] = req.files[n].path) : {};
  // }

  req.files[0] !== undefined ? (image = req.files[0].path) : {};
  req.files[1] !== undefined ? (image2 = req.files[1].path) : {};
  req.files[2] !== undefined ? (image3 = req.files[2].path) : {};
  req.files[3] !== undefined ? (image4 = req.files[3].path) : {};

  const createdProduct = new Product({
    name,
    firm,
    description,
    price,

    image,
    image2,
    image3,
    image4,

    viewedCount: 0,
    likedCount: 0,
    purchasedCount: 0,
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
