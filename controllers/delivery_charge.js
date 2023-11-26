const db = require("../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../config/helper");

exports.getCharge = async (req, res, next) => {
  try {
    db.beginTransaction(async (err) => {
      if (err) {
        return res.status(503).json({
          status: false,
          message: "Internal Server Error",
          charge: [],
        });
      }
      try {
        const get_charge_query = `SELECT * from delivery_charge`;

        const charges_data = await queryAsyncWithoutValue(get_charge_query);
        if (charges_data.length === 0) {
          return res.status(200).json({
            status: false,
            message: "No charge found",
            charge: [],
          });
        }
        db.commit((err) => {
          if (err) {
            db.rollback(() => {
              return res.status(500).json({
                status: false,
                message: "Failed to find charge data",
                charge: [],
              });
            });
          }
          return res.status(200).json({
            status: true,
            message: "",
            charge: charges_data,
          });
        });
      } catch (e) {
        console.log(e);
        return res.status(503).json({
          status: false,
          message: "Internal Server Error",
          charge: [],
        });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({
      status: false,
      message: "Internal Server Error",
      charge: [],
    });
  }
};
