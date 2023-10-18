const router = require("express").Router();
const {
  getDashboard,
} = require("../../controllers/adminApi/dashboardController");

router.get("/adminApi", getDashboard);

module.exports = router;
