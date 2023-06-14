const express = require("express");

const router = express.Router();

const { check } = require("express-validator");

const productsControllers = require("../controllers/products-controllers");

const fileUpload = require("../middleware/file-upload");

router.get("/", productsControllers.getProductsList);

router.get("/:pid", productsControllers.getProductById);

// router.post("/", check("name").not().isEmpty(), productsControllers.createProduct);
// router.post("/", fileUpload.single("image"), productsControllers.createProduct);

router.post(
  "/",
  fileUpload.array("image", 4),
  productsControllers.createProduct
);

router.patch("/:pid", productsControllers.updateProduct);
// router.post("/:pid", productsControllers.updateProduct);

router.delete("/:pid", productsControllers.deleteProduct);

module.exports = router;
