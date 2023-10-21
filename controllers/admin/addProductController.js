const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");

exports.getAddProducts = async (req, res, next) => {
  try {
    const productQuery = `SELECT * FROM products INNER JOIN product_image ON products.product_id = product_image.product_id JOIN extra_cat ON products.product_cat_id = extra_cat.extra_cat_id WHERE product_image.featured_image = 1`;
    const extraCats = `SELECT * FROM extra_cat`;
    const products = await queryAsyncWithoutValue(productQuery);
    const extraCat = await queryAsyncWithoutValue(extraCats);

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
