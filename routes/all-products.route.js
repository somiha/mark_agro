const express = require("express");
const {
  allProducts,
  productsByCat,
} = require("../controllers/all-products.controller");
const router = express.Router();

router.get("/allProducts", allProducts);
router.get("/productsByCat", productsByCat);

module.exports = router;
