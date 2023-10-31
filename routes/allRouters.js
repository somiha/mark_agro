const express = require("express");
const Router = express.Router();

const allCategoryRouter = require("./all-category.route");
const productDetailsRouter = require("./product-details.route");
const fvProductsRouter = require("./favourite-products.route");
const orderDetailsRouter = require("./order-details.route");
const ordersRouter = require("./orders.route");
const productsRouter = require("./products.route");
const settingsRouter = require("./settings.route");
const logInRouter = require("./login.route");
const regRouter = require("./registration.route");
const cart = require("./cart.route");
const all_products = require("./all-products.route");
const startPage = require("./flashSell.route");
const variant = require("./variant.route");

//somiha
const adminRoute = require("./adminRoute/adminRoute");
const adminApiRoute = require("./adminApiRoute/adminApiRoute");

Router.use(productDetailsRouter);
Router.use(fvProductsRouter);
Router.use(orderDetailsRouter);
Router.use(ordersRouter);
Router.use(productsRouter);
Router.use(settingsRouter);
Router.use(allCategoryRouter);
Router.use(logInRouter);
Router.use(regRouter);
Router.use(cart);
Router.use(all_products);
Router.use(startPage);
Router.use(variant);
//somiha
Router.use(adminRoute);
Router.use(adminApiRoute);

module.exports = Router;
