const express = require("express");
const { startScreen } = require("../controllers/flashSell.contoller");
const router = express.Router();

router.get("/flashSell", startScreen);

module.exports = router;
