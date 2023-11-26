const { query } = require("express");
const db = require("../config/database.config");
const catModel = require("../middlewares/cat");

exports.orderDetails = async (req, res) => {
  try {
    const [images] = await Promise.all([catModel.fetchFeaturedImages()]);
    var orderId = req.query.orderId;
    var userId = req.query.userId;
    db.query(
      "SELECT * FROM `order_details` INNER JOIN `orders` ON `orders`.`order_id` = `order_details`.`order_id` INNER JOIN `products` ON `products`.`product_id` = `order_details`.`product_id` WHERE `orders`.`order_id` = ?",
      [orderId],
      (err1, order_details) => {
        console.log(order_details);
        if (!err1) {
          order_details.forEach((product) => {
            product.productImage = null;
            images.forEach((image) => {
              if (product.product_id == image.product_id) {
                product.productImage = image.product_image_url;
              }
            });
            product.address = JSON.parse(product.address);
          });

          if (order_details[0].user_id == userId) {
            res.status(200).json({
              status: true,
              message: `Successfully Fetched Details of Order : ${orderId}`,
              client: {
                order_details,
              },
            });
          } else {
            res.status(200).json({
              status: false,
              message: `User : ${userId} is UNAUTHORIZED To Access Order ID : ${orderId}`,
              client: {},
            });
            return;
          }
        } else {
          console.log(err1);
          res.status(500).json({
            status: false,
            message: "Internal Server Error!",
            client: { err1 },
          });
          return;
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error!",
      client: { err },
    });
  }
};
