const express = require("express");

const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const favsControllers = require("../controllers/favs-controllers");

router.use(checkAuth);

router.get("/", favsControllers.getFavsList);

router.get("/ids", favsControllers.getFavsIdsList);

router.post("/:pid", favsControllers.addToFavs);

router.delete("/:pid", favsControllers.deleteFromFavs);

module.exports = router;
