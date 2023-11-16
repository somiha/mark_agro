const router = require("express").Router();
const {
  getAllProducts,
  FlashSell,
} = require("../../controllers/admin/allProductController");

const {
  getBanners,
  postBanner,
  updateBanner,
  deleteBanners,
} = require("../../controllers/admin/banner");

const {
  getCharges,
  postCharge,
  updateCharge,
  deleteCharges,
} = require("../../controllers/admin/delivery_charge");

const {
  getMessages,
  postMessage,
  updateMessage,
  deleteMessage,
} = require("../../controllers/admin/message");

const {
  getSubAdmin,
  postSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
} = require("../../controllers/admin/subAdmin");

const {
  editProduct,
  postEditProduct,
  deleteNonFeaturedImage,
  deleteVariant,
  deleteProduct,
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
  deleteMainCat,
} = require("../../controllers/admin/mainCatController");

const {
  getSubCat,
  postSubCat,
  updateSubCat,
  deleteSubCat,
} = require("../../controllers/admin/subCatController");

const {
  getExtraCat,
  postExtraCat,
  updateExtraCat,
  deleteExtraCat,
} = require("../../controllers/admin/extraCatController");

const {
  getAddProducts,
  postAddProduct,
} = require("../../controllers/admin/addProductController");

const upload = require("../../middlewares/uploadMiddleware");
const multiUpload = require("../../middlewares/multiupload");
const {
  getEditor,
  postEditor,
  updateEditor,
  deleteEditor,
} = require("../../controllers/admin/editor");

// router.get("/", getDashboard);
router.get("/", getAllProducts);
router.get("/banners", getBanners);

router.get("/messages", getMessages);
router.post("/add-messages", postMessage);
router.post("/update-messages", updateMessage);
router.post("/delete-message", deleteMessage);

router.get("/sub-admin", getSubAdmin);
router.post("/add-sub-admin", postSubAdmin);
router.post("/update-sub-admin", updateSubAdmin);
router.post("/delete-sub-admin", deleteSubAdmin);

router.get("/editor", getEditor);
router.post("/add-editor", postEditor);
router.post("/update-editor", updateEditor);
router.post("/delete-editor", deleteEditor);

router.get("/charges", getCharges);
router.post("/add-charge", postCharge);
router.post("/update-charge", updateCharge);
router.post("/delete-charge", deleteCharges);

router.post(
  "/add-banners",
  multiUpload.fields([{ name: "banner-image" }]),
  postBanner
);
router.post(
  "/update-banners",
  multiUpload.fields([{ name: "banner-image" }]),
  updateBanner
);
router.get("/all-customers", getAllCustomers);
router.get("/all-orders", getAllOrders);
router.post("/all-orders", updateStatus);
router.get("/add-products", getAddProducts);
// router.get("/all-products", updateFlashsellStatus);
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

router.post("/delete-extra-category", deleteExtraCat);
router.post("/delete-sub-category", deleteSubCat);
router.post("/delete-main-category", deleteMainCat);

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
router.post("/delete-product", deleteProduct);

router.post("/delete-banner", deleteBanners);

router.post("/flashsell", FlashSell);

module.exports = router;
