const db = require("../config/database.config");
const catModel = require("../middlewares/cat");

// exports.orders = async (req, res) => {
//     var userId = req.query.userId;
//       db.query(
//         "SELECT * FROM `orders` WHERE `user_id` = ?  ORDER BY `orders`.`placed_date` DESC",
//         [userId],  (err1, orders) => {
//           if (!err1) {
//             orders.forEach(order => {
//               order.address = JSON.parse(order.address)
//             });
//             res.status(200).json({
//               status: true,
//               message: `Successfully Fetched Details of User : ${userId}`,
//               client: {
//                 orders,
//               },
//             });
//           } else {
//             console.log(err1);
//             res.status(500).json({
//               status: false,
//               message: "Internal Server Error!",
//               client: { err1 },
//             });
//           }
//         }
//       );
// };

exports.orders = async (req, res) => {
  var userId = req.query.userId;
  db.query(
    "SELECT * FROM `orders` WHERE `user_id` = ?  ORDER BY `orders`.`placed_date` DESC",
    [userId],
    (err1, orders) => {
      if (!err1) {
        orders.forEach((order) => {
          order.address = JSON.parse(order.address);
        });
        // Fetch user_info from the user table
        db.query(
          "SELECT * FROM `user` WHERE `user_id` = ?",
          [userId],
          (err2, user) => {
            if (!err2) {
              res.status(200).json({
                status: true,
                message: `Successfully Fetched Details of User : ${userId}`,
                client: {
                  // Assuming that user_id is unique
                  orders,
                  user_info: user[0],
                },
              });
            } else {
              console.log(err2);
              res.status(500).json({
                status: false,
                message: "Internal Server Error!",
                client: { err2 },
              });
            }
          }
        );
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
