const HttpError = require("../models/http-error");
const User = require("../models/user");

let users;

const getUsersList = async (req, res, next) => {
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(new HttpError("Could not find any users", 500));
  }

  if (users.length === 0) {
    return res.json({ message: "There are no users in database" });
  }

  res.status(200).json({ users: users.map(user => user.toObject({ getters: true }) ) });
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

  const createdUser = new User({
    username,
    password,
    favItems: [],
    cartItems: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Could not save the user object", 500));
  }

  res.status(201).json({ createdUser: createdUser.toObject({ getters: true }) });
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
    return next(new HttpError("Logging in failed, no such username registered", 422));
  }
  if (existingUser.password !== password) {
    return next(new HttpError("Logging in failed, wrong password given", 422));
  }

  res.status(200).json({ message: "Logged in" });
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
