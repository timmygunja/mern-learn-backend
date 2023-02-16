const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const HttpError = require("./models/http-error");

const productsRoutes = require("./routes/products-routes");
const usersRoutes = require("./routes/users-routes");
const favsRoutes = require("./routes/favs-routes");
const cartRoutes = require("./routes/cart-routes");

const app = express();

app.use(bodyParser.json());

const cors = require("cors");

app.use(cors());

// app.use("/uploads/images", express.static(path.join("uploads", "images")));
// app.use('/uploads/images', express.static('uploads/images'));
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "./uploads/images"))
);

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, Username"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//   // res.header("Access-Control-Allow-Credentials", true);
//   next();
// });

app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/favorites", favsRoutes);
app.use("/api/cart", cartRoutes);

app.use((req, res, next) => {
  return next(new HttpError("Could not find this path", 404));
});

// FAILED REQUESTS LAND HERE
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  // res.status(error.code || 500);
  res.status(error.status || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    // "mongodb+srv://admin:admin@cluster0.lwsbc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    process.env.MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    // app.listen(5000);
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
