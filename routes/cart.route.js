const express = require("express");
const { addToCart, delCart, updateCart, placeOrder, cancelOrder, deliveryAddress } = require("../controllers/cart.controller");
const router = express.Router();

router.post("/addToCart", addToCart);
router.delete("/cart_del", delCart);
router.get("/placeOrder", placeOrder);
router.delete("/cancelOrder", cancelOrder);
router.post("/update_cart", updateCart);
router.post("/deliveryAddress", deliveryAddress);

module.exports = router;