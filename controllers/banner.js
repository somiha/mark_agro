const db = require("../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../config/helper");

exports.getBanner = async (req, res, next) => {
  try {
    db.beginTransaction(async (err) => {
      if (err) {
        return res.status(503).json({
          status: false,
          message: "Internal Server Error",
          banner: [],
        });
      }
      try {
        const get_banner_query = `SELECT * from Banner`;

        const banners_data = await queryAsyncWithoutValue(get_banner_query);
        if (banners_data.length === 0) {
          return res.status(200).json({
            status: false,
            message: "No banner found",
            banner: [],
          });
        }
        db.commit((err) => {
          if (err) {
            db.rollback(() => {
              return res.status(500).json({
                status: false,
                message: "Failed to find banner data",
                banner: [],
              });
            });
          }
          return res.status(200).json({
            status: true,
            message: "",
            banner: banners_data,
          });
        });
      } catch (e) {
        console.log(e);
        return res.status(503).json({
          status: false,
          message: "Internal Server Error",
          banner: [],
        });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({
      status: false,
      message: "Internal Server Error",
      banner: [],
    });
  }
};
