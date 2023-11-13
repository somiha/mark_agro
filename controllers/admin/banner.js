const { log } = require("console");
const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const fs = require("fs");
const path = require("path");
const baseUrl = process.env.baseUrl;

exports.getBanners = async (req, res, next) => {
  try {
    const bannerQuery = `SELECT * FROM banner`;
    const banners = await queryAsyncWithoutValue(bannerQuery);
    const page = parseInt(req.query.page) || 1;
    const bannersPerPage = 8;
    const startIdx = (page - 1) * bannersPerPage;
    const endIdx = startIdx + bannersPerPage;
    const paginatedBanners = banners.slice(startIdx, endIdx);
    return res.status(200).render("pages/banner", {
      title: "Banners",
      banners,
      paginatedBanners,
      bannersPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.postBanner = async (req, res, next) => {
  try {
    const bannerImage = req.files["banner-image"];

    if (bannerImage && bannerImage.length > 0) {
      const bannerImageUrl = `${baseUrl}/uploads/${bannerImage[0].filename}`;
      const insertBannerQuery =
        "INSERT INTO banner (banner_image_url) VALUES (?)";
      const bannerValues = [bannerImageUrl];

      db.query(insertBannerQuery, bannerValues, (err, result) => {
        if (err) {
          throw err;
        }

        const bannerId = result.insertId;

        return res.redirect("/banners");
      });
    } else {
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const { banner_id, previous_banner_image } = req.body;
    let splited_image = previous_banner_image.split("/");
    let image_name = splited_image[splited_image.length - 1];

    const imagePath = path.join(__dirname, "../../public/uploads/", image_name);

    const bannerImage = req.files["banner-image"];

    let bannerImageUrl = null;
    if (bannerImage && bannerImage.length > 0) {
      bannerImageUrl = `${baseUrl}/uploads/${bannerImage[0].filename}`;
    }

    const updateBannerQuery =
      "UPDATE banner SET banner_image_url = ? WHERE banner_id = ?";
    const bannerValues = [bannerImageUrl, banner_id];

    db.query(updateBannerQuery, bannerValues, (err, result) => {
      if (err) {
        throw err;
      }
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting image:", unlinkErr);
          return res.status(500).json({ msg: "Internal server error" });
        }
      });

      return res.redirect("/banners");
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteBanners = async (req, res, next) => {
  try {
    let id = req.query.id;

    let selectBannersQuery =
      "SELECT banner_image_url FROM banner WHERE banner_id = ?";
    db.query(selectBannersQuery, [id], (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length === 0) {
        return res.status(404).json({ msg: "banners not found" });
      }

      const imageFileName = result[0].banner_image_url;
      const parts = imageFileName.split("/");
      const fileNameWithExtension = parts[parts.length - 1];

      const imagePath = path.join(
        __dirname,
        "../../public/uploads/",
        fileNameWithExtension
      );

      let deletebannersQuery = "DELETE FROM banner WHERE banner_id = ?";
      db.query(deletebannersQuery, [id], (dbErr) => {
        if (dbErr) {
          console.error("Error deleting banners:", dbErr);
          return res.status(500).json({ msg: "Internal server error" });
        }

        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting image:", unlinkErr);
            return res.status(500).json({ msg: "Internal server error" });
          }
        });

        return res.redirect("/banners");
      });
    });
  } catch (e) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
