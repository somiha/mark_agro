const express = require("express");
const { getVariant } = require("../controllers/variant.controller");
const router = express.Router();

router.get("/variant/:id", getVariant);

module.exports = router;
