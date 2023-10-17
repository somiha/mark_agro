const express = require("express");
const {
  products,
  del_product,
  filter_published,
  filter_unpublished,
  unpublish_product,
  publish_product
} = require("../controllers/products.controller");
const router = express.Router();

router.get("/products", products);
router.get("/del_product/:id", del_product);
router.get("/filter_published", filter_published);
router.get("/filter_unpublished", filter_unpublished);
router.get("/unpublish_product/:product_id", unpublish_product);
router.get("/publish_product/:product_id", publish_product);
module.exports = router;
