const express = require("express");
const { productDetails, relatedProducts } = require("../controllers/product-details.controller");
const router = express.Router();

router.get("/productDetails", productDetails);
router.get("/relatedProducts", relatedProducts);

module.exports = router;
