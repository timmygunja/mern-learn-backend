const HttpError = require("../models/http-error");
const User = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

let users;

const getUsersList = async (req, res, next) => {
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("Could not find any users", 500));
  }

  if (users.length === 0) {
    return res.json({ message: "There are no users in database" });
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
  let user;
  const userId = req.params.uid;

  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(new HttpError("Could not find user", 500));
  }

  if (!user) {
    return next(new HttpError("User not found", 404));
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const createUser = async (req, res, next) => {
  let existingUser;
  const { username, password } = req.body;

  try {
    existingUser = await User.findOne({ username: username });
  } catch (error) {
    return next(new HttpError("Sign up failed, try again", 500));
  }

  if (existingUser) {
    return next(new HttpError("Sign up failed, username reserved", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Password hashing failed", 500));
  }

  const createdUser = new User({
    username,
    password: hashedPassword,
    cart: [],
    cartQuantity: 0,
    cartTotalPrice: 0,
    favorites: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Could not save the user object", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, username: createdUser.username },
      // "supersecret_key",
      process.env.SECRET_KEY,
      { expiresIn: "6h" }
    );
  } catch (error) {
    return next(new HttpError("Sign up failed, try again", 500));
  }

  res.status(201).json({
    userId: createdUser.id,
    username: unescape(encodeURIComponent(createdUser.username)),
    token: token,
  });
};

const login = async (req, res, next) => {
  let existingUser;
  const { username, password } = req.body;

  try {
    existingUser = await User.findOne({ username: username });
  } catch (error) {
    return next(new HttpError("Logging in failed, try again", 500));
  }

  if (!existingUser) {
    return next(
      new HttpError("Logging in failed, no such username registered", 422)
    );
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError("Logging in failed, wrong password given", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Logging in failed, wrong password given", 401));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, username: existingUser.username },
      // "supersecret_key",
      process.env.SECRET_KEY,
      { expiresIn: "12h" }
    );
  } catch (error) {
    return next(new HttpError("Logging in failed, try again", 500));
  }

  res.status(201).json({
    userId: existingUser.id,
    username: unescape(encodeURIComponent(existingUser.username)),
    token: token,
  });
};

const updateUser = async (req, res, next) => {
  let user;
  const userId = req.params.uid;
  const { username, password } = req.body;

  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(new HttpError("Could not find the user object", 500));
  }

  user.username = username;
  user.password = password;

  try {
    await user.save();
  } catch (err) {
    return next(new HttpError("Could not save the user object", 500));
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
  let user;
  const userId = req.params.uid;

  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(new HttpError("Could not find the user object", 500));
  }

  try {
    await user.delete();
  } catch (err) {
    return next(new HttpError("Could not delete the user object", 500));
  }

  res.status(200).json({ message: "Deleted user successfully" });
};

module.exports.getUsersList = getUsersList;
module.exports.getUserById = getUserById;
module.exports.createUser = createUser;
module.exports.login = login;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
