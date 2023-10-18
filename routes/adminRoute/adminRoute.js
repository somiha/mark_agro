const router = require("express").Router();
const {
  getAllProducts,
} = require("../../controllers/admin/allProductController");

const { getDashboard } = require("../../controllers/admin/dashboardController");

const {
  getAddProducts,
} = require("../../controllers/admin/addProductController");

router.get("/", getDashboard);
router.get("/all-products", getAllProducts);
router.get("/add-products", getAddProducts);

module.exports = router;
