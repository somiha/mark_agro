const express = require("express");
const {
  getWishlist,
  addWishlist,
  delWishlist,
} = require("../controllers/favourite-products.controller");
const router = express.Router();

router.get("/getWishlist", getWishlist);
router.post("/addWishlist", addWishlist);
router.delete("/delWishlist", delWishlist);

module.exports = router;
