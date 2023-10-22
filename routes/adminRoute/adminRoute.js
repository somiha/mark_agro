const router = require("express").Router();
const {
  getAllProducts,
} = require("../../controllers/admin/allProductController");

const { getDashboard } = require("../../controllers/admin/dashboardController");

const { getMainCat } = require("../../controllers/admin/catController");

const {
  getAddProducts,
  postAddProduct,
} = require("../../controllers/admin/addProductController");

const upload = require("../../middlewares/uploadMiddleware");
const multiUpload = require("../../middlewares/multiupload");

router.get("/", getDashboard);
router.get("/all-products", getAllProducts);
router.get("/add-products", getAddProducts);
router.post(
  "/add-products",
  multiUpload.fields([
    { name: "product-featured-image" },
    { name: "product-image" },
  ]),
  postAddProduct
);
router.get("/main-category", getMainCat);

module.exports = router;
