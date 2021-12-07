const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");

const productsRoutes = require("./routes/products-routes");
const usersRoutes = require("./routes/users-routes");
const favsRoutes = require("./routes/favs-routes");
const cartRoutes = require("./routes/cart-routes");

const app = express();
app.use(express.json())

app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/favourites", favsRoutes);
app.use("/api/cart", cartRoutes);

app.use((req, res, next) => {
  return next(new HttpError("Could not find this path", 404));
});

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.lwsbc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
      console.log(err);
  });
