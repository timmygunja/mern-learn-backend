const express = require("express");

const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const cartControllers = require("../controllers/cart-controllers");

router.use(checkAuth);

router.get("/", cartControllers.getCartList);

router.get("/getCartLength", cartControllers.getCartLength);

router.post("/:pid", cartControllers.addToCart);

router.delete("/:pid", cartControllers.deleteFromCart);

module.exports = router;
