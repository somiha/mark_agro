const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");

exports.getAllProducts = async (req, res, next) => {
  try {
    const productQuery = `SELECT * FROM products INNER JOIN product_image ON products.product_id = product_image.product_id JOIN extra_cat ON products.product_cat_id = extra_cat.extra_cat_id WHERE product_image.featured_image = 1`;
    const products = await queryAsyncWithoutValue(productQuery);
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
