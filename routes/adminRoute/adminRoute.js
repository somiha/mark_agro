const router = require("express").Router();
const {
  getAllProducts,
} = require("../../controllers/admin/allProductController");

const { getDashboard } = require("../../controllers/admin/dashboardController");

const { getMainCat } = require("../../controllers/admin/catController");

const {
  getAddProducts,
} = require("../../controllers/admin/addProductController");

router.get("/", getDashboard);
router.get("/all-products", getAllProducts);
router.get("/add-products", getAddProducts);
router.get("/main-category", getMainCat);

module.exports = router;
