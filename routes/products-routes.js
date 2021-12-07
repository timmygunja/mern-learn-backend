const express = require("express");

const router = express.Router();

const { check } = require("express-validator")

const productsControllers = require("../controllers/products-controllers");

router.get("/", productsControllers.getProductsList);

router.get("/:pid", productsControllers.getProductById);

router.post("/", check("name").not().isEmpty(), productsControllers.createProduct);

router.patch("/:pid", productsControllers.updateProduct);

router.delete("/:pid", productsControllers.deleteProduct);

module.exports = router;
