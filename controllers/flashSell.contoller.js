const { query } = require("express");
const db = require("../config/database.config");
const catModel = require("../middlewares/cat");

exports.startScreen = (req, res) => {
  db.query(
    `SELECT
    flashsell.flashsell_id,
    flashsell.product_id,
    extra_cat_name AS product_category,
    products.*,
    COALESCE(product_image.product_image_url, '') AS featured_image,
    CASE
        WHEN products.status = 1 THEN 'published'
        WHEN products.status = 0 THEN 'unpublished'
        ELSE NULL
    END AS status
FROM
    flashsell
JOIN products ON flashsell.product_id = products.product_id
JOIN extra_cat ON extra_cat.extra_cat_id = products.product_cat_id
LEFT JOIN product_image ON product_image.product_id = flashsell.product_id AND product_image.featured_image = 1;
`,
    (err1, res1) => {
      if (!err1) {
        res.status(200).json({
          status: true,
          message: `Successfully Fetched Flash Sells Product`,
          client: {
            res1,
          },
        });
      } else {
        console.log(err1);
        res.status(500).json({
          status: false,
          message: "Internal Server Error!",
          client: { err1 },
        });
      }
    }
  );
};
