const router = require("express").Router();
const {
  getAllProducts,
} = require("../../controllers/admin/allProductController");

const { getDashboard } = require("../../controllers/admin/dashboardController");

const {
  getMainCat,
  postMainCat,
} = require("../../controllers/admin/mainCatController");

const {
  getSubCat,
  postSubCat,
} = require("../../controllers/admin/subCatController");

const {
  getExtraCat,
  postExtraCat,
} = require("../../controllers/admin/extraCatController");

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

router.post(
  "/main-category",
  multiUpload.fields([{ name: "main-cat-image" }]),
  postMainCat
);

router.get("/sub-category", getSubCat);

router.post(
  "/sub-category",
  multiUpload.fields([{ name: "sub-cat-image" }]),
  postSubCat
);

router.get("/extra-category", getExtraCat);

router.post(
  "/extra-category",
  multiUpload.fields([{ name: "extra-cat-image" }]),
  postSubCat
);

module.exports = router;
