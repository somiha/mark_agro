const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const baseUrl = process.env.baseUrl;
exports.getMainCat = async (req, res, next) => {
  try {
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

    const page = parseInt(req.query.page) || 1;
    const productsPerPage = 8;
    const startIdx = (page - 1) * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    const paginatedCategories = mainCats.slice(startIdx, endIdx);

    return res.status(200).render("pages/mainCategory", {
      title: "Main Category",
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

exports.postMainCat = async (req, res, next) => {
  try {
    const { main_cat_name } = req.body;
    const mainCatImage = req.files["main-cat-image"];

    if (mainCatImage && mainCatImage.length > 0) {
      const mainCatImageUrl = `${baseUrl}/uploads/${mainCatImage[0].filename}`;
      const insertMainCatQuery =
        "INSERT INTO main_cat (main_cat_name, main_cat_image_url) VALUES (?, ?)";
      const mainCatValues = [main_cat_name, mainCatImageUrl];

      db.query(insertMainCatQuery, mainCatValues, (err, result) => {
        if (err) {
          throw err;
        }

        const mainCatId = result.insertId;

        return res.redirect("/main-category");
      });
    } else {
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// exports.postMainCat = async (req, res, next) => {
//   try {
//     const { main_cat_name } = req.body;
//     const mainCatImage = req.files["main-cat-image"];
//     let mainCatImageUrl = null;
//     if (mainCatImage && mainCatImage.length > 0) {
//       mainCatImageUrl = `${baseUrl}/uploads/${mainCatImage[0].filename}`;
//     }
//     // const mainCatImageUrl = `${baseUrl}/uploads/${mainCatImage[0].filename}`;

//     const insertMainCatQuery =
//       "INSERT INTO main_cat (main_cat_name, main_cat_image_url) VALUES (?, ?)";
//     const mainCatValues = [main_cat_name, mainCatImageUrl];

//     db.query(insertMainCatQuery, mainCatValues, (err, result) => {
//       if (err) {
//         throw err;
//       }

//       const mainCatId = result.insertId;

//       return res.redirect("/main-category");
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// };
