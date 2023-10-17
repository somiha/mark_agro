const db = require("../config/database.config");
const catModel = require("../middlewares/cat");

exports.orders = async (req, res) => {
    var userId = req.query.userId;
      db.query(
        "SELECT * FROM `orders` WHERE `user_id` = ?  ORDER BY `orders`.`placed_date` DESC",
        [userId],  (err1, orders) => {
          if (!err1) {
            orders.forEach(order => {
              order.address = JSON.parse(order.address)
            });
            res.status(200).json({
              status: true,
              message: `Successfully Fetched Details of User : ${userId}`,
              client: {
                orders,
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
