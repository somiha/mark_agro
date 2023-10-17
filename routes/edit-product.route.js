const express = require("express");
const { edit_product, edit_productPost, edit_branded_productPost } = require("../controllers/edit-product.controller");
const router = express.Router();

router.get("/edit_product/:id", edit_product);
router.post("/edit_product/:id", edit_productPost);
router.post("/edit_branded_product/:id", edit_branded_productPost);

module.exports = router;