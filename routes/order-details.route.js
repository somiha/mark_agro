const express = require("express");
const { orderDetails } = require("../controllers/order-details.controller");
const router = express.Router();

router.get("/order_details", orderDetails);

module.exports = router;
