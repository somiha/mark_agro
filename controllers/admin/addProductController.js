const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const db = require("../../config/database.config");

const baseUrl = process.env.baseUrl;

exports.getAddProducts = async (req, res, next) => {
  try {
    const productQuery = `SELECT * FROM products INNER JOIN product_image ON products.product_id = product_image.product_id JOIN extra_cat ON products.product_cat_id = extra_cat.extra_cat_id WHERE product_image.featured_image = 1`;
    const extraCats = `SELECT * FROM extra_cat`;
    const products = await queryAsyncWithoutValue(productQuery);
    const extraCat = await queryAsyncWithoutValue(extraCats);
    const pid = products[0].product_id;
    console.log(products[0].product_id);

    return res.status(200).render("pages/addProducts", {
      title: "All Product",
      products,
      pid,
      extraCat,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

// exports.postAddProduct = async (req, res, next) => {
//   try {
//     const x = req.body;
//     console.log({ x });
//     // console.log(req.files);
//     // console.log(req.file);
//   } catch (err) {
//     console.log(e);
//     return res.status(503).json({ msg: "Internal Server Error" });
//   }
// };

// exports.postAddProduct = async (req, res, next) => {
//   try {
//     // Extract product information from the request body
//     const x = req.body;
//     console.log({ x });
//     let { product_name, product_price, product_details_des, product_cat_id } =
//       req.body;

//     // Handle multiple categories, if necessary
//     // const categories = product_cat_id.split(",");

//     // Handle product images
//     const productImages = req.files; // Assuming you are using a file upload middleware to handle images

//     // Build an array to store product image URLs
//     const productImageUrls = [];

//     // Process product images
//     if (productImages && productImages.length > 0) {
//       productImages.forEach((image) => {
//         productImageUrls.push(`${baseUrl}/uploads/${image.filename}`);
//       });
//     }

//     // Insert the product into the database
//     const insertProductQuery =
//       "INSERT INTO products (product_name, product_price, product_details_des,product_cat_id ) VALUES (?, ?, ?, ?)";
//     const productValues = [
//       product_name,
//       product_price,
//       product_details_des,
//       product_cat_id,
//     ];

//     db.query(insertProductQuery, productValues, (err, result) => {
//       if (err) {
//         throw err;
//       }

//       const productId = result.insertId;

//       // Insert product images into the product_image table
//       const insertProductImageQuery =
//         "INSERT INTO product_image (product_id, product_image, is_featured) VALUES (?, ?, ?)";

//       // Assuming the first uploaded image is featured
//       let isFirstImage = true;

//       productImageUrls.forEach((imageURL) => {
//         const isFeatured = isFirstImage ? 1 : 0;
//         isFirstImage = false;

//         const imageValues = [productId, imageURL, isFeatured];

//         db.query(insertProductImageQuery, imageValues, (err, res) => {
//           if (err) {
//             throw err;
//           }
//           console.log({ res });
//         });
//       });

//       // Insert product categories into the extra_cat table
//       const insertProductCategoryQuery =
//         "INSERT INTO extra_cat (extra_cat_id, extra_cat_name) VALUES (?, ?)";

//       categories.forEach((catId) => {
//         // Fetch category name from your data source or use the catId as the name
//         const categoryName = catId;

//         const catValues = [catId, categoryName];

//         db.query(insertProductCategoryQuery, catValues, (err, res) => {
//           if (err) {
//             throw err;
//           }
//           console.log({ res });
//         });
//       });

//       return res.redirect("/add-products");
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

// exports.postAddProduct = async (req, res, next) => {
//   try {
//     // Extract product information from the request body
//     const x = req.body;
//     console.log({ x });
//     let { product_name, product_price, product_details_des, product_cat_id } =
//       req.body;

//     // Handle product images
//     const productImages = req.files; // Assuming you are using a file upload middleware to handle images

//     // Build an array to store product image URLs
//     const productImageUrls = [];

//     // Process product images
//     if (productImages && productImages.length > 0) {
//       productImages.forEach((image) => {
//         productImageUrls.push(`${baseUrl}/uploads/${image.filename}`);
//       });
//     }

//     // Insert the product into the database
//     const insertProductQuery =
//       "INSERT INTO products (product_name, product_price, product_details_des, product_cat_id) VALUES (?, ?, ?, ?)";
//     const productValues = [
//       product_name,
//       product_price,
//       product_details_des,
//       product_cat_id,
//     ];

//     db.query(insertProductQuery, productValues, (err, result) => {
//       if (err) {
//         throw err;
//       }

//       const productId = result.insertId;

//       // Insert product images into the product_image table
//       const insertProductImageQuery =
//         "INSERT INTO product_image (product_id, product_image, is_featured) VALUES (?, ?, ?)";

//       // Assuming the first uploaded image is featured
//       let isFirstImage = true;

//       productImageUrls.forEach((imageURL) => {
//         const isFeatured = isFirstImage ? 1 : 0;
//         isFirstImage = false;

//         const imageValues = [productId, imageURL, isFeatured];

//         db.query(insertProductImageQuery, imageValues, (err, res) => {
//           if (err) {
//             throw err;
//           }
//           console.log({ res });
//         });
//       });

//       return res.redirect("/add-products");
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

exports.postAddProduct = async (req, res, next) => {
  try {
    // Extract product information from the request body
    const x = req.body;
    console.log({ x });
    let {
      product_name,
      product_price,
      product_details_des,
      product_cat_id,
      quantity,
    } = req.body;

    // Handle product images
    const featuredImage = req.files["product-featured-image"][0]; // Assuming you're expecting one featured image
    const productImages = req.files["product-image"]; // Assuming you're expecting an array of product images

    // Build an array to store product image URLs
    const productImageUrls = [];

    // Process featured image
    let isFirstImage = true;
    const featuredImageUrl = `${baseUrl}/uploads/${featuredImage.filename}`;
    productImageUrls.push({ url: featuredImageUrl, isFeatured: 1 });

    // Process product images
    productImages.forEach((image) => {
      const imageURL = `${baseUrl}/uploads/${image.filename}`;
      productImageUrls.push({ url: imageURL, isFeatured: 0 });
    });

    // Insert the product into the database
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

      // Insert product images into the product_image table
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

      return res.redirect("/add-products");
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
