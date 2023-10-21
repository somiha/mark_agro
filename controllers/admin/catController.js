const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");

exports.getMainCat = async (req, res, next) => {
  try {
    const mainCatQuery = `SELECT main_cat.*, products.*, product_image.*, (SELECT SUM(order_details.product_total_price) FROM order_details WHERE order_details.product_id = products.product_id) AS total_price
FROM main_cat
INNER JOIN products ON products.product_cat_id = main_cat.main_cat_id
INNER JOIN product_image ON products.product_id = product_image.product_id
WHERE product_image.featured_image = 1;
`;
    // const extraCats = `SELECT * FROM extra_cat`;
    const mainCats = await queryAsyncWithoutValue(mainCatQuery);
    // const extraCat = await queryAsyncWithoutValue(extraCats);

    return res.status(200).render("pages/mainCategory", {
      title: "All Product",
      mainCats,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
