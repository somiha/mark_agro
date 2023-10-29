const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");

exports.getAllProducts = async (req, res, next) => {
  try {
    const productQuery = `SELECT 
    p.*,
    e.extra_cat_name,
    v.variant_name,
    v.price AS variant_price,
    (SELECT GROUP_CONCAT(product_image_url) 
     FROM product_image 
     WHERE product_image.product_id = p.product_id AND product_image.featured_image = 0) AS non_featured_images,
    (SELECT product_image_url 
     FROM product_image 
     WHERE product_image.product_id = p.product_id AND product_image.featured_image = 1) AS featured_image
FROM products p
INNER JOIN extra_cat e ON p.product_cat_id = e.extra_cat_id
LEFT JOIN variant v ON p.product_id = v.product_id;
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
