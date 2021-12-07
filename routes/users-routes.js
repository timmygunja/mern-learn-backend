const express = require("express");

const router = express.Router();

const usersControllers = require("../controllers/users-controllers");

router.get("/", usersControllers.getUsersList);

router.get("/:uid", usersControllers.getUserById);

router.post("/signup", usersControllers.createUser);

router.post("/login", usersControllers.login);

router.patch("/:uid", usersControllers.updateUser);

router.delete("/:uid", usersControllers.deleteUser);


module.exports = router;
