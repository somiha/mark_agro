const express = require("express");
const { getMessage } = require("../controllers/message");
const router = express.Router();

router.get("/message", getMessage);

module.exports = router;
