const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const db = require("../../config/database.config");

const baseUrl = process.env.baseUrl;

exports.getAddProducts = async (req, res, next) => {
  try {
    const productQuery = `SELECT * FROM products INNER JOIN product_image ON products.product_id = product_image.product_id JOIN extra_cat ON products.product_cat_id = extra_cat.extra_cat_id WHERE product_image.featured_image = 1`;
    const extraCats = `SELECT * FROM extra_cat`;
    const products = await queryAsyncWithoutValue(productQuery);
    const extraCat = await queryAsyncWithoutValue(extraCats);
    // const pid = products[0].product_id;

    return res.status(200).render("pages/addProducts", {
      title: "All Product",
      products,

      extraCat,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const x = req.body;
    const productQuery = `SELECT * FROM products INNER JOIN product_image ON products.product_id = product_image.product_id JOIN extra_cat ON products.product_cat_id = extra_cat.extra_cat_id WHERE product_image.featured_image = 1`;
    const extraCats = `SELECT * FROM extra_cat`;
    const products = await queryAsyncWithoutValue(productQuery);
    const extraCat = await queryAsyncWithoutValue(extraCats);
    // const pid = products[0].product_id;

    let {
      product_name,
      product_price,
      product_details_des,
      product_cat_id,
      quantity,
      variant_name,
      variant_price,
    } = req.body;
    console.log(req.body);
    const featuredImage = req.files["product-featured-image"][0];
    const productImages = req.files["product-image"];

    const productImageUrls = [];

    if (!featuredImage) {
      const featuredImageError = "Product must have a featured image.";
      return res.render("pages/addProducts", {
        title: "All Product",
        featuredImageError,
        productImageUrls: [],
        products,

        extraCat,
      });
    }

    if (!productImages || productImages.length === 0) {
      const otherImagesError =
        "Product must have at least one additional image.";
      return res.render("pages/addProducts", {
        title: "All Product",
        otherImagesError,
        productImageUrls: [],
        products,

        extraCat,
      });
    }

    let isFirstImage = true;
    const featuredImageUrl = `${baseUrl}/uploads/${featuredImage.filename}`;
    productImageUrls.push({ url: featuredImageUrl, isFeatured: 1 });

    productImages.forEach((image) => {
      const imageURL = `${baseUrl}/uploads/${image.filename}`;
      productImageUrls.push({ url: imageURL, isFeatured: 0 });
    });

    const insertProductQuery =
      "INSERT INTO products (product_name, product_price, product_details_des, product_cat_id, seller_id, quantity) VALUES (?, ?, ?, ?, 1, ?)";
    const productValues = [
      product_name,
      product_price,
      product_details_des,
      product_cat_id,
      quantity,
    ];

    db.query(insertProductQuery, productValues, (err, result) => {
      if (err) {
        throw err;
      }

      const productId = result.insertId;

      const insertProductImageQuery =
        "INSERT INTO product_image (product_id, product_image_url, featured_image) VALUES (?, ?, ?)";

      productImageUrls.forEach((imageData) => {
        const { url, isFeatured } = imageData;
        const imageValues = [productId, url, isFeatured];

        db.query(insertProductImageQuery, imageValues, (err, res) => {
          if (err) {
            throw err;
          }
          console.log({ res });
        });
      });
      if (variant_name && variant_price) {
        if (Array.isArray(variant_name) && Array.isArray(variant_price)) {
          for (let i = 0; i < variant_name.length; i++) {
            const insertVariantQuery =
              "INSERT INTO variant (product_id, variant_name, price) VALUES (?, ?, ?)";
            const variantValues = [
              productId,
              variant_name[i],
              variant_price[i],
            ];

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
              productId,
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
    });

    return res.redirect("/add-products");
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
