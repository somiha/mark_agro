const express = require("express");
const { getBanner } = require("../controllers/banner");
const router = express.Router();

router.get("/banner", getBanner);

module.exports = router;
