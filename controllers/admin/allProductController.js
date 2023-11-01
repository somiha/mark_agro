const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");

exports.getAllProducts = async (req, res, next) => {
  try {
    const productQuery = `SELECT 
    p.*,
    e.extra_cat_name,
    GROUP_CONCAT(DISTINCT v.variant_name ORDER BY v.variant_id ASC) AS variant_names,
    GROUP_CONCAT(DISTINCT v.price ORDER BY v.variant_id ASC) AS variant_prices,
    (SELECT GROUP_CONCAT(product_image_url) 
     FROM product_image 
     WHERE product_image.product_id = p.product_id AND product_image.featured_image = 0) AS non_featured_images,
    (SELECT product_image_url 
     FROM product_image 
     WHERE product_image.product_id = p.product_id AND product_image.featured_image = 1) AS featured_image
FROM products p
INNER JOIN extra_cat e ON p.product_cat_id = e.extra_cat_id
LEFT JOIN variant v ON p.product_id = v.product_id
GROUP BY p.product_id;



`;

    const products = await queryAsyncWithoutValue(productQuery);
    // console.log({ products });
    const page = parseInt(req.query.page) || 1;
    const productsPerPage = 8;
    const startIdx = (page - 1) * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    const paginatedProducts = products.slice(startIdx, endIdx);
    return res.status(200).render("pages/allProducts", {
      title: "All Product",
      products,
      paginatedProducts,
      productsPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const {
      product_id,
      product_name,
      product_price,
      product_details_des,
      product_cat_id,
      seller_id,
      quantity,
      variants, // An array of updated variants
      deletedVariants, // An array of variant IDs to delete
      images, // An array of updated image URLs
      deletedImages, // An array of image URLs to delete
      featured_image, // The updated featured image URL
    } = req.body;

    // 1. Update product information
    const updateProductQuery = `
      UPDATE products
      SET product_name = ?,
          product_price = ?,
          product_details_des = ?,
          product_cat_id = ?,
          seller_id = ?,
          quantity = ?
      WHERE product_id = ?;
    `;
    await queryAsync(updateProductQuery, [
      product_name,
      product_price,
      product_details_des,
      product_cat_id,
      seller_id,
      quantity,
      product_id,
    ]);

    // 2. Update or insert variants
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        const { variant_id, variant_name, price } = variant;

        // Check if the variant exists, and update it if it does
        const existingVariantQuery = `
          SELECT variant_id FROM variant
          WHERE variant_id = ?;
        `;
        const existingVariant = await queryAsync(existingVariantQuery, [
          variant_id,
        ]);

        if (existingVariant.length > 0) {
          // Variant exists, update it
          const updateVariantQuery = `
            UPDATE variant
            SET variant_name = ?,
                price = ?
            WHERE variant_id = ?;
          `;
          await queryAsync(updateVariantQuery, [
            variant_name,
            price,
            variant_id,
          ]);
        } else {
          // Variant doesn't exist, insert it
          const insertVariantQuery = `
            INSERT INTO variant (product_id, variant_name, price)
            VALUES (?, ?, ?);
          `;
          await queryAsync(insertVariantQuery, [
            product_id,
            variant_name,
            price,
          ]);
        }
      }
    }

    // 3. Delete variants
    if (deletedVariants && deletedVariants.length > 0) {
      for (const variantId of deletedVariants) {
        const deleteVariantQuery = `
          DELETE FROM variant
          WHERE variant_id = ?;
        `;
        await queryAsync(deleteVariantQuery, [variantId]);
      }
    }

    // 4. Update or insert images
    if (images && images.length > 0) {
      for (const imageUrl of images) {
        const existingImageQuery = `
      SELECT product_image_id FROM product_image
      WHERE product_id = ? AND product_image_url = ?;
    `;
        const existingImage = await queryAsync(existingImageQuery, [
          product_id,
          imageUrl,
        ]);

        if (existingImage.length > 0) {
          // Image exists, update it (if needed)
          const updateImageQuery = `
        UPDATE product_image
        SET featured_image = 0  -- Update other image properties if needed
        WHERE product_id = ? AND product_image_url = ?;
      `;
          await queryAsync(updateImageQuery, [product_id, imageUrl]);
        } else {
          // Image doesn't exist, insert it
          const insertImageQuery = `
        INSERT INTO product_image (product_id, product_image_url, featured_image)
        VALUES (?, ?, 0);
      `;
          await queryAsync(insertImageQuery, [product_id, imageUrl]);
        }
      }
    }

    // 5. Delete images
    if (deletedImages && deletedImages.length > 0) {
      for (const imageUrl of deletedImages) {
        const deleteImageQuery = `
      DELETE FROM product_image
      WHERE product_id = ? AND product_image_url = ?;
    `;
        await queryAsync(deleteImageQuery, [product_id, imageUrl]);
      }
    }

    // 6. Update featured image
    if (featured_image) {
      const updateFeaturedImageQuery = `
        UPDATE product_image
        SET featured_image = 0
        WHERE product_id = ?;
        UPDATE product_image
        SET featured_image = 1
        WHERE product_id = ? AND product_image_url = ?;
      `;
      await queryAsync(updateFeaturedImageQuery, [
        product_id,
        product_id,
        featured_image,
      ]);
    }

    return res.status(200).json({ msg: "Product updated successfully" });
  } catch (e) {
    console.error(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
