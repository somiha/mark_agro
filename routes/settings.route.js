const express = require("express");
const { userProfile, editProfile, settings_change_pass, storeInfoEdit, picEdit } = require("../controllers/settings.controller");
const router = express.Router();

router.get("/userProfile", userProfile);
router.post("/editProfile", editProfile);
router.post("/editPic", picEdit);

module.exports = router;
