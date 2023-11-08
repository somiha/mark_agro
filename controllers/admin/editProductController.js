const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const db = require("../../config/database.config");
const fs = require("fs");
const path = require("path");

const baseUrl = process.env.baseUrl;

exports.editProduct = async (req, res, next) => {
  try {
    const product_id = req.query.product_id;
    // console.log(product_id);

    const productQuery = `SELECT
        p.*,
        e.extra_cat_name,
        GROUP_CONCAT(DISTINCT v.variant_id ORDER BY v.variant_id ASC) AS variant_ids,
        GROUP_CONCAT(DISTINCT v.variant_name ORDER BY v.variant_id ASC) AS variant_names,
        GROUP_CONCAT(DISTINCT v.price ORDER BY v.variant_id ASC) AS variant_prices,
        (SELECT GROUP_CONCAT(product_image_url)
         FROM product_image
         WHERE product_image.product_id = p.product_id AND product_image.featured_image = 0) AS non_featured_images,
        (SELECT GROUP_CONCAT(id)
         FROM product_image
         WHERE product_image.product_id = p.product_id AND product_image.featured_image = 0) AS non_featured_image_id,
        (SELECT product_image_url
         FROM product_image
         WHERE product_image.product_id = p.product_id AND product_image.featured_image = 1) AS featured_image,
         (SELECT id
         FROM product_image
         WHERE product_image.product_id = p.product_id AND product_image.featured_image = 1) AS featured_image_id
    FROM products p
    INNER JOIN extra_cat e ON p.product_cat_id = e.extra_cat_id
    LEFT JOIN variant v ON p.product_id = v.product_id
    WHERE p.product_id = ?
    GROUP BY p.product_id;`;

    //     const productQuery = `SELECT
    //     p.*,
    //     e.extra_cat_name,
    //     GROUP_CONCAT(DISTINCT v.variant_id ORDER BY v.variant_id ASC) AS variant_ids,
    //     GROUP_CONCAT(DISTINCT v.variant_name ORDER BY v.variant_id ASC) AS variant_names,
    //     GROUP_CONCAT(DISTINCT v.price ORDER BY v.variant_id ASC) AS variant_prices,
    //     (SELECT GROUP_CONCAT(DISTINCT product_image_url)
    //      FROM product_image
    //      WHERE product_image.product_id = p.product_id AND product_image.featured_image = 0
    //      LIMIT 1
    //     ) AS non_featured_images,
    //     (SELECT GROUP_CONCAT(DISTINCT id)
    //      FROM product_image
    //      WHERE product_image.product_id = p.product_id AND product_image.featured_image = 0
    //      LIMIT 1
    //     ) AS non_featured_image_id,
    //     (SELECT DISTINCT product_image_url
    //      FROM product_image
    //      WHERE product_image.product_id = p.product_id AND product_image.featured_image = 1
    //      LIMIT 1
    //     ) AS featured_image,
    //      (SELECT DISTINCT id
    //      FROM product_image
    //      WHERE product_image.product_id = p.product_id AND product_image.featured_image = 1
    //      LIMIT 1
    //     ) AS featured_image_id
    // FROM products p
    // INNER JOIN extra_cat e ON p.product_cat_id = e.extra_cat_id
    // LEFT JOIN variant v ON p.product_id = v.product_id
    // WHERE p.product_id = ?
    // GROUP BY p.product_id;`;

    const extraCats = `SELECT * FROM extra_cat`;

    const product_data = await queryAsync(productQuery, [product_id]);
    console.log(product_data);
    const extraCat = await queryAsyncWithoutValue(extraCats);
    const non_featured_images = product_data[0].non_featured_images;
    const non_featured_image_id = product_data[0].non_featured_image_id;

    const variant_id = product_data[0].variant_ids;
    const variant_name = product_data[0].variant_names;
    const variant_price = product_data[0].variant_prices;
    console.log({ variant_id });
    console.log({ variant_name });
    console.log({ variant_price });

    console.log(non_featured_images, non_featured_image_id);

    const non_featured_images_json = JSON.stringify(non_featured_images);
    const non_featured_image_id_json = JSON.stringify(non_featured_image_id);

    return res.status(200).render("pages/editProduct", {
      title: "All Product",
      product_data,
      extraCat,
      non_featured_images,
      non_featured_image_id,
      variant_id,
      variant_name,
      variant_price,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

// exports.postEditProduct = async (req, res, next) => {
//   try {
//     const {
//       product_id,
//       product_name,
//       product_price,
//       product_details_des,
//       product_cat_id,
//       quantity,
//     } = req.body;

//     let product_featured_image = null; // Initialize to null

//     if (
//       req.files &&
//       req.files.product_featured_image &&
//       req.files.product_featured_image[0]
//     ) {
//       // New featured image provided
//       product_featured_image = req.files.product_featured_image[0].filename;
//     }
//     // const product_featured_image = req.files.product_featured_image[0].filename;
//     const featuredImageUrl = `${baseUrl}/uploads/${product_featured_image}`;

//     console.log(product_featured_image);

//     const updateProductQuery = `
//       UPDATE products
//       SET product_name = ?,
//           product_price = ?,
//           product_details_des = ?,
//           product_cat_id = ?,
//           quantity = ?
//       WHERE product_id = ?;
//     `;
//     await queryAsync(updateProductQuery, [
//       product_name,
//       product_price,
//       product_details_des,
//       product_cat_id,
//       quantity,
//       product_id,
//     ]);

//     if (featuredImageUrl) {
//       const updateFeaturedImageQuery = `
//         UPDATE product_image
//         SET featured_image = 1, product_image_url = ?
//         WHERE product_id = ?;
//       `;
//       await queryAsync(updateFeaturedImageQuery, [
//         featuredImageUrl,
//         product_id,
//         ,
//       ]);
//     }
//     const productImages = req.files["product-image"];
//     const productImageUrls = [];
//     productImages.forEach((image) => {
//       const imageURL = `${baseUrl}/uploads/${image.filename}`;
//       productImageUrls.push({ url: imageURL, isFeatured: 0 });
//     });

//     // Fetch existing images from the database
//     const selectExistingImagesQuery =
//       "SELECT product_image_url FROM product_image WHERE product_id = ?";
//     db.query(selectExistingImagesQuery, [product_id], (err, existingImages) => {
//       if (err) {
//         throw err;
//       }

//       const existingImageUrls = existingImages.map(
//         (row) => row.product_image_url
//       );

//       // Insert the new images
//       const insertProductImageQuery =
//         "INSERT INTO product_image (product_id, product_image_url, featured_image) VALUES (?, ?, ?)";

//       productImageUrls.forEach((imageData) => {
//         const { url, isFeatured } = imageData;
//         if (!existingImageUrls.includes(url)) {
//           const imageValues = [product_id, url, isFeatured];
//           db.query(insertProductImageQuery, imageValues, (err, res) => {
//             if (err) {
//               throw err;
//             }
//             console.log({ res });
//           });
//         }
//       });
//     });

//     return res.redirect("/all-products");
//   } catch (e) {
//     console.error(e);
//     return res.status(503).json({ msg: "Internal Server Error" });
//   }
// };

exports.postEditProduct = async (req, res, next) => {
  try {
    const {
      product_id,
      product_name,
      product_price,
      product_details_des,
      product_cat_id,
      quantity,
      unit,
      discount,
      status,
      variant_name,
      variant_price,
      featured_image_id,
    } = req.body;

    let product_featured_image = null; // Initialize to null

    if (
      req.files &&
      req.files.product_featured_image &&
      req.files.product_featured_image[0]
    ) {
      // New featured image provided
      product_featured_image = req.files.product_featured_image[0].filename;
    }

    const featuredImageUrl = product_featured_image
      ? `${baseUrl}/uploads/${product_featured_image}`
      : null;

    console.log(product_featured_image);

    const updateProductQuery = `
      UPDATE products
      SET product_name = ?,
          product_price = ?,
          product_details_des = ?,
          product_cat_id = ?,
          quantity = ?,
          unit = ?,
          discount = ?,
          status = ?
      WHERE product_id = ?;
    `;
    await queryAsync(updateProductQuery, [
      product_name,
      product_price,
      product_details_des,
      product_cat_id,
      quantity,
      unit,
      discount,
      status,
      product_id,
    ]);

    if (featuredImageUrl) {
      const updateFeaturedImageQuery = `
        UPDATE product_image
        SET featured_image = 1, product_image_url = ?
        WHERE product_id = ? AND id = ?;
      `;
      await queryAsync(updateFeaturedImageQuery, [
        featuredImageUrl,
        product_id,
        featured_image_id,
      ]);
    }

    // Process product images only if they were included in the request
    if (req.files && req.files["product-image"]) {
      const productImages = req.files["product-image"];
      const productImageUrls = [];
      productImages.forEach((image) => {
        const imageURL = `${baseUrl}/uploads/${image.filename}`;
        productImageUrls.push({ url: imageURL });
      });

      // Fetch existing images from the database
      const selectExistingImagesQuery =
        "SELECT product_image_url FROM product_image WHERE product_id = ?";
      db.query(
        selectExistingImagesQuery,
        [product_id],
        (err, existingImages) => {
          if (err) {
            throw err;
          }

          const existingImageUrls = existingImages.map(
            (row) => row.product_image_url
          );

          // Insert the new images
          const insertProductImageQuery =
            "INSERT INTO product_image (product_id, product_image_url, featured_image) VALUES (?, ?, 0)";

          productImageUrls.forEach((imageData) => {
            const { url } = imageData;
            if (!existingImageUrls.includes(url)) {
              const imageValues = [product_id, url];
              db.query(insertProductImageQuery, imageValues, (err, res) => {
                if (err) {
                  throw err;
                }
                console.log({ res });
              });
            }
          });
        }
      );
    }

    if (variant_name && variant_price) {
      if (Array.isArray(variant_name) && Array.isArray(variant_price)) {
        for (let i = 0; i < variant_name.length; i++) {
          const insertVariantQuery =
            "INSERT INTO variant (product_id, variant_name, price) VALUES (?, ?, ?)";
          const variantValues = [product_id, variant_name[i], variant_price[i]];

          db.query(insertVariantQuery, variantValues, (err, result) => {
            if (err) {
              throw err;
            }
          });
        }
      } else {
        // If variant_name and variant_price are not arrays (single values), convert them to arrays
        const variantNameArray = [variant_name];
        const variantPriceArray = [variant_price];

        for (let i = 0; i < variantNameArray.length; i++) {
          const insertVariantQuery =
            "INSERT INTO variant (product_id, variant_name, price) VALUES (?, ?, ?)";
          const variantValues = [
            product_id,
            variantNameArray[i],
            variantPriceArray[i],
          ];

          db.query(insertVariantQuery, variantValues, (err, result) => {
            if (err) {
              throw err;
            }
          });
        }
      }
    }

    return res.redirect("/all-products");
  } catch (e) {
    console.error(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

// exports.deleteNonFeaturedImage = async (req, res, next) => {
//   try {
//     const image_id = req.query.image_id;
//     const queryDeleteImage = `
//     DELETE from product_image where id = ${image_id};
//     `;
//     await queryAsyncWithoutValue(queryDeleteImage);
//     res.status(200).json({ message: "Successfully deleted message." });
//   } catch (err) {
//     return res.status(503).json({ msg: "Internal Server Error" });
//   }
// };

exports.deleteNonFeaturedImage = async (req, res, next) => {
  try {
    const image_id = req.query.image_id;

    // First, retrieve the image filename from the database (if needed)
    const selectImageQuery =
      "SELECT product_image_url FROM product_image WHERE id = ?";
    const imageResult = await queryAsync(selectImageQuery, [image_id]);

    if (imageResult.length === 0) {
      return res.status(404).json({ msg: "Image not found" });
    }

    const imageUrl = imageResult[0].product_image_url;
    const parts = imageUrl.split("/");
    const fileNameWithExtension = parts[parts.length - 1];

    const imagePath = path.join(
      __dirname,
      "../../public/uploads/",
      fileNameWithExtension
    );

    // Delete the image file
    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image:", unlinkErr);
        return res.status(500).json({ msg: "Internal server error" });
      }

      // If the image file was deleted successfully, proceed to delete the image from the database
      const deleteImageQuery = "DELETE FROM product_image WHERE id = ?";
      queryAsync(deleteImageQuery, [image_id])
        .then(() => {
          res.status(200).json({ message: "Successfully deleted image." });
        })
        .catch((dbErr) => {
          console.error("Error deleting image from the database:", dbErr);
          res.status(500).json({ msg: "Internal server error" });
        });
    });
  } catch (err) {
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.deleteVariant = async (req, res, next) => {
  try {
    console.log(req.query);
    const id = req.query.id;
    const queryDeleteVariant = `
    DELETE from variant where variant_id = ${id};
    `;
    await queryAsyncWithoutValue(queryDeleteVariant);
    res.status(200).json({ message: "Successfully deleted message." });
  } catch (err) {
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product_id = req.query.id; // Get the product ID from the request parameters

    // Query the product information to obtain the image file names
    const selectProductQuery =
      "SELECT product_image_url FROM product_image WHERE product_id = ?";
    db.query(selectProductQuery, [product_id], (err, productResult) => {
      if (err) {
        throw err;
      }

      if (productResult.length === 0) {
        return res.status(404).json({ msg: "Product not found" });
      }
      console.log({ productResult });
      const featuredImageFileName = productResult[0].product_image_url;
      const parts = featuredImageFileName.split("/");
      const fileNameWithExtension = parts[parts.length - 1];

      const imagePath = path.join(
        __dirname,
        "../../public/uploads/",
        fileNameWithExtension
      );

      // If the image was deleted successfully, proceed to delete the product from the database
      let deleteProductQuery = "DELETE FROM products WHERE product_id = ?";
      db.query(deleteProductQuery, [product_id], (dbErr) => {
        if (dbErr) {
          console.error("Error deleting product:", dbErr);
          return res.status(500).json({ msg: "Internal server error" });
        }

        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting image:", unlinkErr);
            return res.status(500).json({ msg: "Internal server error" });
          }

          // After deleting the product and its associated image, you can redirect to a suitable page
          return res.redirect("/all-products");
        });
        const selectVariantQuery = "DELETE FROM variant WHERE product_id = ?";
        db.query(selectVariantQuery, [product_id], (err, variantResult) => {
          if (err) {
            throw err;
          }
        });
        const selectImageQuery =
          "DELETE FROM product_image WHERE product_id = ?";
        db.query(selectImageQuery, [product_id], (err, imageResult) => {
          if (err) {
            throw err;
          }
        });
      });
    });
  } catch (e) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
