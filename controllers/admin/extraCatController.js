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

// exports.postExtraCat = async (req, res, next) => {
//   try {
//     const { extra_cat_name, extra_cat_ref } = req.body;
//     const extraCatImage = req.files["extra-cat-image"][0];
//     const extraCatImageUrl = `${baseUrl}/uploads/${extraCatImage.filename}`;
//     const insertextraCatQuery =
//       "INSERT INTO extra_cat (extra_cat_name, extra_cat_ref, extra_cat_image_url) VALUES (?, ?, ?)";
//     const extraCatValues = [extra_cat_name, extra_cat_ref, extraCatImageUrl];

//     db.query(insertextraCatQuery, extraCatValues, (err, result) => {
//       if (err) {
//         throw err;
//       }
//       const extraCatId = result.insertId;

//       return res.redirect("/extra-category");
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

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
      // Handle the case when no image is provided (if needed)
      // You can add custom logic here or simply close the form
      // without returning any error response.
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

    // Check if an image is provided for the update (if needed)
    let extraCatImageUrl = null;
    if (extraCatImage && extraCatImage.length > 0) {
      extraCatImageUrl = `${baseUrl}/uploads/${extraCatImage[0].filename}`;
    }

    // Check if extraCatImageUrl is not null, indicating an image update
    if (extraCatImageUrl) {
      // Update both the extra_cat_name, extra_cat_ref, and extra_cat_image_url
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
      // If no image is provided for the update, update only extra_cat_name and extra_cat_ref
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

// exports.deleteExtraCat = async (req, res, next) => {
//   try {
//     const id = req.query.id; // Get the product ID from the request parameters

//     const selectQuery =
//       "SELECT product_id FROM products WHERE product_cat_id = ?";

//     db.query(selectQuery, [id], (err, queryResult) => {
//       if (err) {
//         throw err;
//       }
//       const product_id = queryResult[0].product_id;
//       console.log(queryResult);
//       // Query the product information to obtain the image file names
//       const selectProductQuery =
//         "SELECT product_image_url FROM product_image WHERE product_id = ?";
//       db.query(selectProductQuery, [product_id], (err, productResult) => {
//         if (err) {
//           throw err;
//         }

//         if (productResult.length === 0) {
//           return res.status(404).json({ msg: "Product not found" });
//         }
//         console.log({ productResult });
//         const featuredImageFileName = productResult[0].product_image_url;
//         const parts = featuredImageFileName.split("/");
//         const fileNameWithExtension = parts[parts.length - 1];

//         const imagePath = path.join(
//           __dirname,
//           "../../public/uploads/",
//           fileNameWithExtension
//         );
//         let deleteCatQuery = "DELETE FROM extra_cat WHERE extra_cat_id = ?";
//         db.query(deleteCatQuery, [id], (dbErr) => {
//           if (dbErr) {
//             console.error("Error deleting:", dbErr);
//             return res.status(500).json({ msg: "Internal server error" });
//           }
//           // If the image was deleted successfully, proceed to delete the product from the database
//           let deleteProductQuery =
//             "DELETE FROM products WHERE product_cat_id = ?";
//           db.query(deleteProductQuery, [id], (dbErr) => {
//             if (dbErr) {
//               console.error("Error deleting product:", dbErr);
//               return res.status(500).json({ msg: "Internal server error" });
//             }

//             fs.unlink(imagePath, (unlinkErr) => {
//               if (unlinkErr) {
//                 console.error("Error deleting image:", unlinkErr);
//                 return res.status(500).json({ msg: "Internal server error" });
//               }

//               // After deleting the product and its associated image, you can redirect to a suitable page
//               return res.redirect("/extra-category");
//             });
//             const selectVariantQuery =
//               "DELETE FROM variant WHERE product_id = ?";
//             db.query(selectVariantQuery, [product_id], (err, variantResult) => {
//               if (err) {
//                 throw err;
//               }
//             });
//             const selectImageQuery =
//               "DELETE FROM product_image WHERE product_id = ?";
//             db.query(selectImageQuery, [product_id], (err, imageResult) => {
//               if (err) {
//                 throw err;
//               }
//             });
//           });
//         });
//       });
//     });
//   } catch (e) {
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

exports.deleteExtraCat = async (req, res, next) => {
  try {
    const id = req.query.id; // Get the extra_cat_id from the request parameters

    // Delete the category first
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

        // Extract product_ids from the queryResult
        const productIds = queryResult.map((result) => result.product_id);

        // Check if there are associated products to delete
        if (productIds.length === 0) {
          // No associated products found, so no need to proceed further
          return res.redirect("/extra-category");
        }

        // Delete products, variants, and product images associated with the extra category
        let deleteProductsQuery =
          "DELETE FROM products WHERE product_cat_id = ?";
        db.query(deleteProductsQuery, [id], (deleteProductsErr) => {
          if (deleteProductsErr) {
            console.error("Error deleting products:", deleteProductsErr);
            return res.status(500).json({ msg: "Internal server error" });
          }

          let deleteVariantsQuery =
            "DELETE FROM variant WHERE product_id IN (?)";
          db.query(deleteVariantsQuery, [productIds], (deleteVariantsErr) => {
            if (deleteVariantsErr) {
              console.error("Error deleting variants:", deleteVariantsErr);
              return res.status(500).json({ msg: "Internal server error" });
            }

            let deleteImagesQuery =
              "DELETE FROM product_image WHERE product_id IN (?)";
            db.query(deleteImagesQuery, [productIds], (deleteImagesErr) => {
              if (deleteImagesErr) {
                console.error(
                  "Error deleting product images:",
                  deleteImagesErr
                );
                return res.status(500).json({ msg: "Internal server error" });
              }

              // After deleting the extra category, products, variants, and product images, you can redirect to a suitable page
              return res.redirect("/extra-category");
            });
          });
        });
      });
    });
  } catch (e) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
