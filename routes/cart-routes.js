const express = require("express");

const router = express.Router();

const { check } = require("express-validator")

const cartControllers = require("../controllers/cart-controllers");

router.get("/", cartControllers.getCartList);

router.post("/:pid", cartControllers.addToCart);

router.delete("/:pid", cartControllers.deleteFromCart);

module.exports = router;
