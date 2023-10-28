const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const baseUrl = process.env.baseUrl;
exports.getExtraCat = async (req, res, next) => {
  try {
    const extraCatQuery = `SELECT extra_cat.*, sub_cat.sub_cat_name AS extra_cat_ref_name, COUNT(products.product_id) AS total_products
FROM extra_cat
LEFT JOIN products ON products.product_cat_id = extra_cat.extra_cat_id
LEFT JOIN product_image ON products.product_id = product_image.product_id
LEFT JOIN sub_cat ON extra_cat.extra_cat_ref = sub_cat.sub_cat_id
WHERE product_image.featured_image = 1 OR products.product_id IS NULL
GROUP BY extra_cat.extra_cat_id;

`;
    const subCatQuery = `SELECT sub_cat.*, main_cat.main_cat_name AS sub_cat_ref_name, COUNT(products.product_id) AS total_products
FROM sub_cat
LEFT JOIN extra_cat ON sub_cat.sub_cat_ref = extra_cat.extra_cat_id
LEFT JOIN products ON extra_cat.extra_cat_id = products.product_cat_id
LEFT JOIN product_image ON products.product_id = product_image.product_id
LEFT JOIN main_cat ON sub_cat.sub_cat_ref = main_cat.main_cat_id
WHERE product_image.featured_image = 1 OR products.product_id IS NULL
GROUP BY sub_cat.sub_cat_id;

`;
    const subCats = await queryAsyncWithoutValue(subCatQuery);

    const extraCats = await queryAsyncWithoutValue(extraCatQuery);

    const page = parseInt(req.query.page) || 1;
    const productsPerPage = 8;
    const startIdx = (page - 1) * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    const paginatedCategories = extraCats.slice(startIdx, endIdx);

    return res.status(200).render("pages/extraCategory", {
      title: "Extra Category",
      paginatedCategories,
      extraCats,
      subCats,
      productsPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

// exports.postExtraCat = async (req, res, next) => {
//   try {
//     const { extra_cat_name, extra_cat_ref } = req.body;
//     const extraCatImage = req.files["extra-cat-image"][0];
//     const extraCatImageUrl = `${baseUrl}/uploads/${extraCatImage.filename}`;
//     const insertextraCatQuery =
//       "INSERT INTO extra_cat (extra_cat_name, extra_cat_ref, extra_cat_image_url) VALUES (?, ?, ?)";
//     const extraCatValues = [extra_cat_name, extra_cat_ref, extraCatImageUrl];

//     db.query(insertextraCatQuery, extraCatValues, (err, result) => {
//       if (err) {
//         throw err;
//       }
//       const extraCatId = result.insertId;

//       return res.redirect("/extra-category");
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

exports.postExtraCat = async (req, res, next) => {
  try {
    const { extra_cat_name, extra_cat_ref } = req.body;
    const extraCatImage = req.files["extra-cat-image"];

    if (extraCatImage && extraCatImage.length > 0) {
      const extraCatImageUrl = `${baseUrl}/uploads/${extraCatImage[0].filename}`;
      const insertExtraCatQuery =
        "INSERT INTO extra_cat (extra_cat_name, extra_cat_ref, extra_cat_image_url) VALUES (?, ?, ?)";
      const extraCatValues = [extra_cat_name, extra_cat_ref, extraCatImageUrl];

      db.query(insertExtraCatQuery, extraCatValues, (err, result) => {
        if (err) {
          throw err;
        }

        const extraCatId = result.insertId;

        return res.redirect("/extra-category");
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
