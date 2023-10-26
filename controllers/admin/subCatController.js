const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const baseUrl = process.env.baseUrl;
exports.getSubCat = async (req, res, next) => {
  try {
    const subCatQuery = `SELECT sub_cat.*, main_cat.main_cat_name AS sub_cat_ref_name, COUNT(products.product_id) AS total_products
FROM sub_cat
LEFT JOIN extra_cat ON sub_cat.sub_cat_ref = extra_cat.extra_cat_id
LEFT JOIN products ON extra_cat.extra_cat_id = products.product_cat_id
LEFT JOIN product_image ON products.product_id = product_image.product_id
LEFT JOIN main_cat ON sub_cat.sub_cat_ref = main_cat.main_cat_id
WHERE product_image.featured_image = 1 OR products.product_id IS NULL
GROUP BY sub_cat.sub_cat_id;

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

exports.postSubCat = async (req, res, next) => {
  try {
    const { sub_cat_name, sub_cat_ref } = req.body;

    const subCatImage = req.files["sub-cat-image"][0];

    const subCatImageUrl = `${baseUrl}/uploads/${subCatImage.filename}`;
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
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
