const router = require("express").Router();
const {
  getAllProducts,
} = require("../../controllers/admin/allProductController");

const {
  editProduct,
  postEditProduct,
  deleteNonFeaturedImage,
  deleteVariant,
} = require("../../controllers/admin/editProductController");

const {
  getAllCustomers,
} = require("../../controllers/admin/customerController");

const {
  getAllOrders,
  updateStatus,
} = require("../../controllers/admin/orderController");

const { getDashboard } = require("../../controllers/admin/dashboardController");

const {
  getMainCat,
  postMainCat,
  updateMainCat,
} = require("../../controllers/admin/mainCatController");

const {
  getSubCat,
  postSubCat,
  updateSubCat,
} = require("../../controllers/admin/subCatController");

const {
  getExtraCat,
  postExtraCat,
  updateExtraCat,
} = require("../../controllers/admin/extraCatController");

const {
  getAddProducts,
  postAddProduct,
} = require("../../controllers/admin/addProductController");

const upload = require("../../middlewares/uploadMiddleware");
const multiUpload = require("../../middlewares/multiupload");

router.get("/", getDashboard);
router.get("/all-products", getAllProducts);
router.get("/all-customers", getAllCustomers);
router.get("/all-orders", getAllOrders);
router.post("/all-orders", updateStatus);
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
  postExtraCat
);

router.post(
  "/update-extra-category",
  multiUpload.fields([{ name: "extra-cat-image" }]),
  updateExtraCat
);

router.post(
  "/update-main-category",
  multiUpload.fields([{ name: "main-cat-image" }]),
  updateMainCat
);

router.post(
  "/update-sub-category",
  multiUpload.fields([{ name: "sub-cat-image" }]),
  updateSubCat
);

router.get("/edit-product", editProduct);

router.post(
  "/edit-product",
  multiUpload.fields([
    { name: "product_featured_image" },
    { name: "product-image" },
  ]),
  postEditProduct
);

router.post("/delete-non-featured-image", deleteNonFeaturedImage);
router.post("/delete-variant", deleteVariant);

module.exports = router;
