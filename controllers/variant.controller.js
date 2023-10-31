const db = require("../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../config/helper");

exports.getVariant = async (req, res, next) => {
  try {
    const product_id = req.params.id;
    db.beginTransaction(async (err) => {
      if (err) {
        return res.status(503).json({
          status: false,
          message: "Internal Server Error",
          variant: [],
        });
      }
      try {
        const get_variant_query = `SELECT * from Variant WHERE product_id = ?`;

        const variants_data = await queryAsync(get_variant_query, [product_id]);
        if (variants_data.length === 0) {
          return res.status(200).json({
            status: false,
            message: "No variant found",
            variant: [],
          });
        }
        db.commit((err) => {
          if (err) {
            db.rollback(() => {
              return res.status(500).json({
                status: false,
                message: "Failed to find variant data",
                variant: [],
              });
            });
          }
          return res.status(200).json({
            status: true,
            message: "",
            variant: variants_data,
          });
        });
      } catch (e) {
        console.log(e);
        return res.status(503).json({
          status: false,
          message: "Internal Server Error",
          variant: [],
        });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({
      status: false,
      message: "Internal Server Error",
      variant: [],
    });
  }
};
