const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const baseUrl = process.env.baseUrl;
const fs = require("fs");
const path = require("path");

exports.getSubCat = async (req, res, next) => {
  try {
    const subCatQuery = `

SELECT 
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
    const mainCatQuery = `SELECT main_cat.*, COUNT(products.product_id) AS total_products
FROM main_cat
LEFT JOIN sub_cat ON sub_cat.sub_cat_ref = main_cat.main_cat_id
LEFT JOIN extra_cat ON sub_cat.sub_cat_id = extra_cat.extra_cat_ref
LEFT JOIN products ON products.product_cat_id = extra_cat.extra_cat_id
LEFT JOIN product_image ON products.product_id = product_image.product_id
WHERE product_image.featured_image = 1 OR products.product_id IS NULL
GROUP BY main_cat.main_cat_id;

`;

    const mainCats = await queryAsyncWithoutValue(mainCatQuery);
    const subCats = await queryAsyncWithoutValue(subCatQuery);

    const page = parseInt(req.query.page) || 1;
    const productsPerPage = 8;
    const startIdx = (page - 1) * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    const paginatedCategories = subCats.slice(startIdx, endIdx);

    return res.status(200).render("pages/subCategory", {
      title: "Sub Category",
      subCats,
      mainCats,
      paginatedCategories,
      productsPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

// exports.postSubCat = async (req, res, next) => {
//   try {
//     const { sub_cat_name, sub_cat_ref } = req.body;

//     const subCatImage = req.files["sub-cat-image"][0];

//     const subCatImageUrl = `${baseUrl}/uploads/${subCatImage.filename}`;
//     const insertSubCatQuery =
//       "INSERT INTO sub_cat (sub_cat_name, sub_cat_ref, sub_cat_image_url) VALUES (?, ?, ?)";
//     const subCatValues = [sub_cat_name, sub_cat_ref, subCatImageUrl];

//     db.query(insertSubCatQuery, subCatValues, (err, result) => {
//       if (err) {
//         throw err;
//       }

//       const subCatId = result.insertId;

//       return res.redirect("/sub-category");
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

exports.postSubCat = async (req, res, next) => {
  try {
    const { sub_cat_name, sub_cat_ref } = req.body;
    const subCatImage = req.files["sub-cat-image"];

    if (subCatImage && subCatImage.length > 0) {
      const subCatImageUrl = `${baseUrl}/uploads/${subCatImage[0].filename}`;
      const insertSubCatQuery =
        "INSERT INTO sub_cat (sub_cat_name, sub_cat_ref, sub_cat_image_url) VALUES (?, ?, ?)";
      const subCatValues = [sub_cat_name, sub_cat_ref, subCatImageUrl];

      db.query(insertSubCatQuery, subCatValues, (err, result) => {
        if (err) {
          throw err;
        }

        const subCatId = result.insertId;

        return res.redirect("/sub-category");
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

exports.updateSubCat = async (req, res, next) => {
  try {
    const { subCatId, sub_cat_name, sub_cat_ref } = req.body;
    const subCatImage = req.files["sub-cat-image"];

    // Check if an image is provided for the update (if needed)
    let subCatImageUrl = null;
    if (subCatImage && subCatImage.length > 0) {
      subCatImageUrl = `${baseUrl}/uploads/${subCatImage[0].filename}`;
    }

    // Check if subCatImageUrl is not null, indicating an image update
    if (subCatImageUrl) {
      // Update both the sub_cat_name, sub_cat_ref, and sub_cat_image_url
      const updateSubCatQuery =
        "UPDATE sub_cat SET sub_cat_name = ?, sub_cat_ref = ?, sub_cat_image_url = ? WHERE sub_cat_id = ?";
      const subCatValues = [
        sub_cat_name,
        sub_cat_ref,
        subCatImageUrl,
        subCatId,
      ];

      db.query(updateSubCatQuery, subCatValues, (err, result) => {
        if (err) {
          throw err;
        }

        return res.redirect("/sub-category");
      });
    } else {
      // If no image is provided for the update, update only sub_cat_name and sub_cat_ref
      const updateSubCatQuery =
        "UPDATE sub_cat SET sub_cat_name = ?, sub_cat_ref = ? WHERE sub_cat_id = ?";
      const subCatValues = [sub_cat_name, sub_cat_ref, subCatId];

      db.query(updateSubCatQuery, subCatValues, (err, result) => {
        if (err) {
          throw err;
        }

        return res.redirect("/sub-category");
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// exports.deleteSubCat = async (req, res, next) => {
//   try {
//     const id = req.query.id; // Get the extra_cat_id from the request parameters

//     // Delete the category first
//     let deleteCatQuery = "DELETE FROM sub_cat WHERE sub_cat_id = ?";
//     db.query(deleteCatQuery, [id], (catDeleteErr) => {
//       if (catDeleteErr) {
//         console.error("Error deleting category:", catDeleteErr);
//         return res.status(500).json({ msg: "Internal server error" });
//       }

//       const selectExtraQuery =
//         "SELECT extra_cat_id FROM extra_cat WHERE extra_cat_ref = ?";

//       db.query(selectExtraQuery, [id], (err, extraResult) => {
//         if (err) {
//           throw err;
//         }

//         const selectProductQuery =
//           "SELECT product_id FROM products WHERE product_cat_id = ?";

//         db.query(selectProductQuery, [id], (err, queryResult) => {
//           if (err) {
//             throw err;
//           }

//           // Extract product_ids from the queryResult
//           const productIds = queryResult.map((result) => result.product_id);

//           // Check if there are associated products to delete
//           if (productIds.length === 0) {
//             // No associated products found, so no need to proceed further
//             return res.redirect("/extra-category");
//           }

//           // Delete products, variants, and product images associated with the extra category
//           let deleteProductsQuery =
//             "DELETE FROM products WHERE product_cat_id = ?";
//           db.query(deleteProductsQuery, [id], (deleteProductsErr) => {
//             if (deleteProductsErr) {
//               console.error("Error deleting products:", deleteProductsErr);
//               return res.status(500).json({ msg: "Internal server error" });
//             }

//             let deleteVariantsQuery =
//               "DELETE FROM variant WHERE product_id IN (?)";
//             db.query(deleteVariantsQuery, [productIds], (deleteVariantsErr) => {
//               if (deleteVariantsErr) {
//                 console.error("Error deleting variants:", deleteVariantsErr);
//                 return res.status(500).json({ msg: "Internal server error" });
//               }

//               let deleteImagesQuery =
//                 "DELETE FROM product_image WHERE product_id IN (?)";
//               db.query(deleteImagesQuery, [productIds], (deleteImagesErr) => {
//                 if (deleteImagesErr) {
//                   console.error(
//                     "Error deleting product images:",
//                     deleteImagesErr
//                   );
//                   return res.status(500).json({ msg: "Internal server error" });
//                 }

//                 // After deleting the extra category, products, variants, and product images, you can redirect to a suitable page
//                 return res.redirect("/extra-category");
//               });
//             });
//           });
//         });
//       });
//     });
//   } catch (e) {
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

// exports.deleteSubCat = async (req, res, next) => {
//   try {
//     const id = req.query.id; // Get the sub_cat_id from the request parameters

//     // Delete the sub-category first
//     let deleteSubCatQuery = "DELETE FROM sub_cat WHERE sub_cat_id = ?";
//     db.query(deleteSubCatQuery, [id], (subCatDeleteErr) => {
//       if (subCatDeleteErr) {
//         console.error("Error deleting sub-category:", subCatDeleteErr);
//         return res.status(500).json({ msg: "Internal server error" });
//       }
//       const selectCatQuery =
//         "SELECT extra_cat_id FROM extra_cat WHERE extra_cat_ref = ?";

//       db.query(selectCatQuery, [id], (err, queryResult) => {
//         if (err) {
//           throw err;
//         }
//         const catIds = queryResult.map((result) => result.extra_cat_id);
//         if (catIds.length === 0) {
//           // No associated products found, so no need to proceed further
//           return res.redirect("/sub-category");
//         }
//         let deleteCatQuery = "DELETE FROM extra_cat WHERE extra_cat_ref = ?";
//         db.query(deleteCatQuery, [id], (catDeleteErr) => {
//           if (catDeleteErr) {
//             console.error("Error deleting category:", catDeleteErr);
//             return res.status(500).json({ msg: "Internal server error" });
//           }

//           const selectProductQuery =
//             "SELECT product_id FROM products WHERE product_cat_id = ?";

//           db.query(selectProductQuery, [id], (err, queryResult) => {
//             if (err) {
//               throw err;
//             }

//             // Extract product_ids from the queryResult
//             const productIds = queryResult.map((result) => result.product_id);

//             // Check if there are associated products to delete
//             if (productIds.length === 0) {
//               // No associated products found, so no need to proceed further
//               return res.redirect("/extra-category");
//             }

//             // Delete products, variants, and product images associated with the extra category
//             let deleteProductsQuery =
//               "DELETE FROM products WHERE product_cat_id = ?";
//             db.query(deleteProductsQuery, [id], (deleteProductsErr) => {
//               if (deleteProductsErr) {
//                 console.error("Error deleting products:", deleteProductsErr);
//                 return res.status(500).json({ msg: "Internal server error" });
//               }

//               let deleteVariantsQuery =
//                 "DELETE FROM variant WHERE product_id IN (?)";
//               db.query(
//                 deleteVariantsQuery,
//                 [productIds],
//                 (deleteVariantsErr) => {
//                   if (deleteVariantsErr) {
//                     console.error(
//                       "Error deleting variants:",
//                       deleteVariantsErr
//                     );
//                     return res
//                       .status(500)
//                       .json({ msg: "Internal server error" });
//                   }

//                   let deleteImagesQuery =
//                     "DELETE FROM product_image WHERE product_id IN (?)";
//                   db.query(
//                     deleteImagesQuery,
//                     [productIds],
//                     (deleteImagesErr) => {
//                       if (deleteImagesErr) {
//                         console.error(
//                           "Error deleting product images:",
//                           deleteImagesErr
//                         );
//                         return res
//                           .status(500)
//                           .json({ msg: "Internal server error" });
//                       }

//                       // After deleting the extra category, products, variants, and product images, you can redirect to a suitable page
//                       return res.redirect("/extra-category");
//                     }
//                   );
//                 }
//               );
//             });
//           });
//         });
//       });
//     });
//   } catch (e) {
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

exports.deleteSubCat = async (req, res, next) => {
  try {
    const id = req.query.id;
    console.log(id);
    const deleteSubCatQuery = "DELETE FROM sub_cat WHERE sub_cat_id = ?";

    db.query(deleteSubCatQuery, [id], (subCatDeleteErr) => {
      if (subCatDeleteErr) {
        console.error("Error deleting sub-category:", subCatDeleteErr);
        return res.status(500).json({ msg: "Internal server error" });
      }

      const selectExtraQuery =
        "SELECT extra_cat_id FROM extra_cat WHERE extra_cat_ref = ?";

      db.query(selectExtraQuery, [id], (err, extraCatResults) => {
        if (err) {
          console.error("Error querying extra categories:", err);
          return res.status(500).json({ msg: "Internal server error" });
        }
        console.log({ extraCatResults });

        const extraCatIds = extraCatResults.map(
          (result) => result.extra_cat_id
        );

        if (extraCatIds.length > 0) {
          deleteExtraCategories(extraCatIds, res);
        } else {
          return res.redirect("/sub-category");
        }
      });
    });
  } catch (e) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

function deleteExtraCategories(extraCatIds, res) {
  const productIds = [];

  let deleteExtraCatQuery = "DELETE FROM extra_cat WHERE extra_cat_id IN (?)";
  db.query(deleteExtraCatQuery, [extraCatIds], (deleteExtraCatErr) => {
    if (deleteExtraCatErr) {
      console.error("Error deleting extra categories:", deleteExtraCatErr);
      return res.status(500).json({ msg: "Internal server error" });
    }

    const selectProductQuery =
      "SELECT product_id FROM products WHERE product_cat_id IN (?)";
    db.query(selectProductQuery, [extraCatIds], (err, queryResult) => {
      if (err) {
        console.error("Error querying products:", err);
        return res.status(500).json({ msg: "Internal server error" });
      }
      const productsForExtraCat = queryResult.map(
        (result) => result.product_id
      );
      productIds.push(...productsForExtraCat);

      deleteProductsVariantsImages(productIds, res);
    });
  });
}

// function deleteProductsVariantsImages(productIds, res) {
//   if (productIds.length === 0) {
//     return res.redirect("/sub-category");
//   }

//   let deleteProductsQuery = "DELETE FROM products WHERE product_id IN (?)";
//   db.query(deleteProductsQuery, [productIds], (deleteProductsErr) => {
//     if (deleteProductsErr) {
//       console.error("Error deleting products:", deleteProductsErr);
//       return res.status(500).json({ msg: "Internal server error" });
//     }

//     let deleteVariantsQuery = "DELETE FROM variant WHERE product_id IN (?)";
//     db.query(deleteVariantsQuery, [productIds], (deleteVariantsErr) => {
//       if (deleteVariantsErr) {
//         console.error("Error deleting variants:", deleteVariantsErr);
//         return res.status(500).json({ msg: "Internal server error" });
//       }

//       let deleteImagesQuery =
//         "DELETE FROM product_image WHERE product_id IN (?)";
//       db.query(deleteImagesQuery, [productIds], (deleteImagesErr) => {
//         if (deleteImagesErr) {
//           console.error("Error deleting product images:", deleteImagesErr);
//           return res.status(500).json({ msg: "Internal server error" });
//         }
//         return res.redirect("/sub-category");
//       });
//     });
//   });
// }

function deleteProductsVariantsImages(productIds, res) {
  if (productIds.length === 0) {
    return res.redirect("/sub-category");
  }

  const selectImagesQuery =
    "SELECT product_image_url FROM product_image WHERE product_id IN (?)";
  db.query(selectImagesQuery, [productIds], (selectImagesErr, imageResults) => {
    if (selectImagesErr) {
      console.error("Error querying product images:", selectImagesErr);
      return res.status(500).json({ msg: "Internal server error" });
    }

    const imageUrls = imageResults.map((result) => result.product_image_url);

    const deleteProductsQuery = "DELETE FROM products WHERE product_id IN (?)";
    db.query(deleteProductsQuery, [productIds], (deleteProductsErr) => {
      if (deleteProductsErr) {
        console.error("Error deleting products:", deleteProductsErr);
        return res.status(500).json({ msg: "Internal server error" });
      }

      const deleteVariantsQuery = "DELETE FROM variant WHERE product_id IN (?)";
      db.query(deleteVariantsQuery, [productIds], (deleteVariantsErr) => {
        if (deleteVariantsErr) {
          console.error("Error deleting variants:", deleteVariantsErr);
          return res.status(500).json({ msg: "Internal server error" });
        }

        const deleteImagesQuery =
          "DELETE FROM product_image WHERE product_id IN (?)";
        db.query(deleteImagesQuery, [productIds], (deleteImagesErr) => {
          if (deleteImagesErr) {
            console.error(
              "Error deleting product images from database:",
              deleteImagesErr
            );
            return res.status(500).json({ msg: "Internal server error" });
          }

          // Now delete the images from the upload folder
          imageUrls.forEach((imageUrl) => {
            const parts = imageUrl.split("/");
            const fileNameWithExtension = parts[parts.length - 1];

            const imagePath = path.join(
              __dirname,
              "../../public/uploads/",
              fileNameWithExtension
            );

            fs.unlink(imagePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Error deleting image:", unlinkErr);
                return res.status(500).json({ msg: "Internal server error" });
              }
            });
          });

          return res.redirect("/sub-category");
        });
      });
    });
  });
}
