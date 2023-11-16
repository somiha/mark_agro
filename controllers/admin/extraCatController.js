const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const baseUrl = process.env.baseUrl;
const fs = require("fs");
const path = require("path");

exports.getExtraCat = async (req, res, next) => {
  try {
    const extraCatQuery = `SELECT extra_cat.*, sub_cat.sub_cat_name AS extra_cat_ref_name, COUNT(products.product_id) AS total_products
FROM extra_cat
LEFT JOIN products ON products.product_cat_id = extra_cat.extra_cat_id
LEFT JOIN product_image ON products.product_id = product_image.product_id
LEFT JOIN sub_cat ON extra_cat.extra_cat_ref = sub_cat.sub_cat_id
LEFT JOIN main_cat ON sub_cat.sub_cat_ref = main_cat.main_cat_id
WHERE product_image.featured_image = 1 OR products.product_id IS NULL
GROUP BY extra_cat.extra_cat_id;

`;
    const subCatQuery = `SELECT 
    sub_cat.sub_cat_id,
    sub_cat.sub_cat_name,
    sub_cat.sub_cat_image_url,
    main_cat.main_cat_name AS sub_cat_ref_name,
    COUNT(products.product_id) AS total_products
FROM sub_cat
LEFT JOIN extra_cat ON sub_cat.sub_cat_id = extra_cat.extra_cat_ref
LEFT JOIN products ON products.product_cat_id = extra_cat.extra_cat_id
LEFT JOIN product_image ON products.product_id = product_image.product_id
LEFT JOIN main_cat ON sub_cat.sub_cat_ref = main_cat.main_cat_id
WHERE product_image.featured_image = 1 OR products.product_id IS NULL
GROUP BY sub_cat.sub_cat_id, sub_cat.sub_cat_name, sub_cat_ref_name;

`;
    const subCats = await queryAsyncWithoutValue(subCatQuery);

    const extraCats = await queryAsyncWithoutValue(extraCatQuery);

    const page = parseInt(req.query.page) || 1;
    const productsPerPage = 8;
    const startIdx = (page - 1) * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    const paginatedCategories = extraCats.slice(startIdx, endIdx);

    return res.status(200).render("pages/extraCategory", {
      title: "Extra Category",
      paginatedCategories,
      extraCats,
      subCats,
      productsPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.postExtraCat = async (req, res, next) => {
  try {
    const { extra_cat_name, extra_cat_ref } = req.body;
    const extraCatImage = req.files["extra-cat-image"];

    if (extraCatImage && extraCatImage.length > 0) {
      const extraCatImageUrl = `${baseUrl}/uploads/${extraCatImage[0].filename}`;
      const insertExtraCatQuery =
        "INSERT INTO extra_cat (extra_cat_name, extra_cat_ref, extra_cat_image_url) VALUES (?, ?, ?)";
      const extraCatValues = [extra_cat_name, extra_cat_ref, extraCatImageUrl];

      db.query(insertExtraCatQuery, extraCatValues, (err, result) => {
        if (err) {
          throw err;
        }

        const extraCatId = result.insertId;

        return res.redirect("/extra-category");
      });
    } else {
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updateExtraCat = async (req, res, next) => {
  try {
    const { extraCatId, extra_cat_name, extra_cat_ref } = req.body;
    const extraCatImage = req.files["extra-cat-image"];

    let extraCatImageUrl = null;
    if (extraCatImage && extraCatImage.length > 0) {
      extraCatImageUrl = `${baseUrl}/uploads/${extraCatImage[0].filename}`;
    }

    if (extraCatImageUrl) {
      const updateExtraCatQuery =
        "UPDATE extra_cat SET extra_cat_name = ?, extra_cat_ref = ?, extra_cat_image_url = ? WHERE extra_cat_id = ?";
      const extraCatValues = [
        extra_cat_name,
        extra_cat_ref,
        extraCatImageUrl,
        extraCatId,
      ];

      db.query(updateExtraCatQuery, extraCatValues, (err, result) => {
        if (err) {
          throw err;
        }

        return res.redirect("/extra-category");
      });
    } else {
      const updateExtraCatQuery =
        "UPDATE extra_cat SET extra_cat_name = ?, extra_cat_ref = ? WHERE extra_cat_id = ?";
      const extraCatValues = [extra_cat_name, extra_cat_ref, extraCatId];

      db.query(updateExtraCatQuery, extraCatValues, (err, result) => {
        if (err) {
          throw err;
        }

        return res.redirect("/extra-category");
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteExtraCat = async (req, res, next) => {
  try {
    const id = req.query.id;

    const selectImageQuery =
      "SELECT extra_cat_image_url FROM extra_cat WHERE extra_cat_id = ?";
    db.query(selectImageQuery, [id], (selectImageErr, result) => {
      if (selectImageErr) {
        console.error(
          "Error querying extra category image URL:",
          selectImageErr
        );
        return res.status(500).json({ msg: "Internal server error" });
      }

      const extraCatImageUrl = result[0].extra_cat_image_url;

      let deleteCatQuery = "DELETE FROM extra_cat WHERE extra_cat_id = ?";
      db.query(deleteCatQuery, [id], (catDeleteErr) => {
        if (catDeleteErr) {
          console.error("Error deleting category:", catDeleteErr);
          return res.status(500).json({ msg: "Internal server error" });
        }

        const selectProductQuery =
          "SELECT product_id FROM products WHERE product_cat_id = ?";
        db.query(selectProductQuery, [id], (err, queryResult) => {
          if (err) {
            throw err;
          }

          const productIds = queryResult.map((result) => result.product_id);

          if (productIds.length === 0) {
            deleteImagesAndRedirect([extraCatImageUrl], res, "/extra-category");
          } else {
            let deleteProductsQuery =
              "DELETE FROM products WHERE product_cat_id = ?";
            db.query(deleteProductsQuery, [id], (deleteProductsErr) => {
              if (deleteProductsErr) {
                console.error("Error deleting products:", deleteProductsErr);
                return res.status(500).json({ msg: "Internal server error" });
              }

              let deleteVariantsQuery =
                "DELETE FROM variant WHERE product_id IN (?)";
              db.query(
                deleteVariantsQuery,
                [productIds],
                (deleteVariantsErr) => {
                  if (deleteVariantsErr) {
                    console.error(
                      "Error deleting variants:",
                      deleteVariantsErr
                    );
                    return res
                      .status(500)
                      .json({ msg: "Internal server error" });
                  }

                  let deleteImagesQuery =
                    "DELETE FROM product_image WHERE product_id IN (?)";
                  db.query(
                    deleteImagesQuery,
                    [productIds],
                    (deleteImagesErr, imageResult) => {
                      if (deleteImagesErr) {
                        console.error(
                          "Error deleting product images:",
                          deleteImagesErr
                        );
                        return res
                          .status(500)
                          .json({ msg: "Internal server error" });
                      }

                      const productImageUrls = Array.isArray(imageResult)
                        ? imageResult.map((image) => image.product_image_url)
                        : [];
                      deleteImagesAndRedirect(
                        [extraCatImageUrl, ...productImageUrls],
                        res,
                        "/extra-category"
                      );
                    }
                  );
                }
              );
            });
          }
        });
      });
    });
  } catch (e) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

function deleteImagesAndRedirect(imageUrls, res, redirectUrl) {
  imageUrls.forEach((imageUrl) => {
    const fileName = imageUrl.split("/").pop();
    const imagePath = path.join(__dirname, `../../public/uploads/${fileName}`);

    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image:", unlinkErr);
        return res.status(500).json({ msg: "Internal server error" });
      }
    });
  });

  return res.redirect(redirectUrl);
}
