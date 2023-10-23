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

exports.postMainCat = async (req, res, next) => {
  try {
    // Extract main category information from the request body
    const { main_cat_name } = req.body;

    console.log(req.body);

    // Handle the main category image
    const mainCatImage = req.files["main-cat-image"][0]; // Assuming you're expecting one main category image

    // Build the URL for the main category image
    const mainCatImageUrl = `${baseUrl}/uploads/${mainCatImage.filename}`;

    // Insert the main category into the database
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
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
