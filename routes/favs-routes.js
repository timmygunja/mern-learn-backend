const express = require("express");

const router = express.Router();

const { check } = require("express-validator")

const favsControllers = require("../controllers/favs-controllers");

router.get("/", favsControllers.getFavsList);

router.post("/:pid", favsControllers.addToFavs);

router.delete("/:pid", favsControllers.deleteFromFavs);

module.exports = router;
