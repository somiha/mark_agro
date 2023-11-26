const express = require("express");
const { getCharge } = require("../controllers/delivery_charge");
const router = express.Router();

router.get("/deliveryCharge", getCharge);

module.exports = router;
