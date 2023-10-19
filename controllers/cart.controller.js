const db = require("../config/database.config");

// exports.addToCart = (req, res) => {
//   // var { product_id, seller_id, user_id } = req.query    // For query version

//   var { product_id, seller_id, user_id } = req.body;
//   var order_id = req.body.order_id ? req.body.order_id : null;
//   console.log(order_id);

//   // API security needed ! Check for isLoggedIn or something like that
//   function addCart() {
//     const today = new Date();
//     const sevenDaysFromToday = new Date(today);
//     sevenDaysFromToday.setDate(today.getDate() + 7);
//     if (order_id == null) {
//       db.query(
//         "INSERT INTO `orders` (`order_id`, `user_id`, `order_status`, `seller_id`, `placed_date`, `delivery_date`) VALUES (NULL, ?, ?, ?, ?, ?)",
//         [user_id, 3, seller_id, today, sevenDaysFromToday],
//         (err1, res1) => {
//           if (err1) {
//             console.log(err1);
//             res.status(500).json({
//               status: false,
//               message: "New Order Create Error !",
//               client: { err1 },
//             });
//             return;
//           }
//           order_id = res1.insertId;
//         }
//       );
//     }
//     // already under an order
//     // also order details part
//     db.query(
//       "SELECT * FROM `products` WHERE `products`.`product_id` = ?",
//       [product_id],
//       (err1, res1) => {
//         if (!err1) {
//           db.query(
//             "SELECT * FROM `order_details` WHERE `order_details`.`product_id` = ? AND `order_details`.`order_id` = ?",
//             [product_id, order_id],
//             (err2, res2) => {
//               if (!err2) {
//                 if (res2.length <= 0) {
//                   var query =
//                     "INSERT INTO `order_details` (`order_details_id`, `order_id`, `product_id`, `product_quantity`, `product_total_price`, `note_to_user`, `stock_out`) VALUES (NULL, ?, ?, ?, ?, NULL, ?)";
//                   db.query(
//                     query,
//                     [order_id, product_id, 1, res1[0].product_price, 0],
//                     (err4, res4) => {
//                       if (!err4) {
//                         // New in cart
//                         res.status(200).json({
//                           status: true,
//                           message: `Successfully Added Product: ${res4.insertId} to Cart: ${order_id}`,
//                           client: {
//                             order_id: order_id,
//                             orderDetailsId: res4.insertId,
//                           },
//                         });
//                       } else {
//                         console.log(err4);
//                         res.status(500).json({
//                           status: false,
//                           message: "Internal Server Error !",
//                           client: { err4 },
//                         });
//                         return;
//                       }
//                     }
//                   );
//                 } else {
//                   var perPrice =
//                     res2[0].product_total_price / res2[0].product_quantity;
//                   var alreadyQuery =
//                     "UPDATE `order_details` SET `product_quantity` = ?, `product_total_price` = ? WHERE `order_details`.`order_details_id` = ?";

//                   // Already in cart
//                   db.query(
//                     alreadyQuery,
//                     [
//                       res2[0].product_quantity + 1,
//                       res2[0].product_total_price + perPrice,
//                       res2[0].order_details_id,
//                     ],
//                     (err4, res4) => {
//                       if (!err4) {
//                         res.status(200).json({
//                           status: true,
//                           message: `Successfully Updated Product: ${res2[0].order_details_id} in Cart: ${order_id}`,
//                           client: {
//                             order_id: order_id,
//                             oderDetailsId: res2[0].order_details_id,
//                             productQuantity: res2[0].product_quantity + 1,
//                             productPrice:
//                               res2[0].product_total_price + perPrice,
//                           },
//                         });
//                       } else {
//                         console.log(err4);
//                         res.status(500).json({
//                           status: false,
//                           message: "Internal Server Error !",
//                           client: { err4 },
//                         });
//                         return;
//                       }
//                     }
//                   );
//                 }
//               } else {
//                 console.log(err2);
//                 res.status(500).json({
//                   status: false,
//                   message: "Internal Server Error !",
//                   client: { err2 },
//                 });
//                 return;
//               }
//             }
//           );
//         } else {
//           console.log(err1);
//           res.status(500).json({
//             status: false,
//             message: "Internal Server Error !",
//             client: { err1 },
//           });
//           return;
//         }
//       }
//     );
//   }

//   db.query(
//     "SELECT * FROM `orders` WHERE `order_id` = ?",
//     [order_id],
//     (errPid, resPid) => {
//       if (!errPid) {
//         if (order_id == undefined) {
//           addCart();
//         } else if (order_id != undefined && resPid[0].seller_id == seller_id) {
//           addCart();
//         } else {
//           res.status(200).json({
//             status: false,
//             message:
//               "You have products in your cart from different seller ! Complete it first or cancel the Order !",
//             client: {},
//           });
//           return;
//         }
//       } else {
//         console.log(errPid);
//         res.status(500).json({
//           status: false,
//           message: "Internal Server Error !",
//           client: { errPid },
//         });
//         return;
//       }
//     }
//   );
// };

exports.addToCart = (req, res) => {
  // var { product_id, seller_id, user_id } = req.query    // For query version

  var { product_id, seller_id, user_id } = req.body;
  var order_id = req.body.order_id ? req.body.order_id : null;
  console.log(order_id);

  // API security needed ! Check for isLoggedIn or something like that
  function addCart() {
    const today = new Date();
    const sevenDaysFromToday = new Date(today);
    sevenDaysFromToday.setDate(today.getDate() + 7);
    if (order_id == null) {
      db.query(
        "INSERT INTO `orders` (`order_id`, `user_id`, `order_status`, `seller_id`, `placed_date`, `delivery_date`) VALUES (NULL, ?, ?, ?, ?, ?)",
        [user_id, 3, seller_id, today, sevenDaysFromToday],
        (err1, res1) => {
          if (err1) {
            console.log(err1);
            res.status(500).json({
              status: false,
              message: "New Order Create Error !",
              client: { err1 },
            });
            return;
          }
          order_id = res1.insertId;
        }
      );
    }
    // already under an order
    // also order details part
    db.query(
      "SELECT * FROM `products` WHERE `products`.`product_id` = ?",
      [product_id],
      (err1, res1) => {
        if (!err1) {
          db.query(
            "SELECT * FROM `order_details` WHERE `order_details`.`product_id` = ? AND `order_details`.`order_id` = ?",
            [product_id, order_id],
            (err2, res2) => {
              if (!err2) {
                if (res2.length <= 0) {
                  var query =
                    "INSERT INTO `order_details` (`order_details_id`, `order_id`, `product_id`, `product_quantity`, `product_total_price`, `note_to_user`, `stock_out`) VALUES (NULL, ?, ?, ?, ?, NULL, ?)";
                  db.query(
                    query,
                    [order_id, product_id, 1, res1[0].product_price, 0],
                    (err4, res4) => {
                      if (!err4) {
                        // New in cart
                        // Fetch product info
                        db.query(
                          "SELECT `products`.`product_id`, `products`.`product_name`, `products`.`product_price`, `products`.`product_short_des`, `products`.`product_details_des`, `products`.`product_cat_id`,`products`.`seller_id`,`products`.`sell_count`, `extra_cat`.*, order_details.order_details_id, order_details.product_total_price, order_details.product_quantity, orders.* FROM products INNER JOIN order_details ON order_details.product_id = products.product_id INNER JOIN orders ON orders.order_id = order_details.order_id INNER JOIN `extra_cat` ON `extra_cat`.`extra_cat_id` = `products`.`product_cat_id` WHERE orders.order_id = ?",
                          [order_id],
                          (err3, res3) => {
                            if (!err3) {
                              const productInfo = res3[0];
                              res.status(200).json({
                                status: true,
                                message: `Successfully Added Product: ${res4.insertId} to Cart: ${order_id}`,
                                client: {
                                  order_id: order_id,
                                  orderDetailsId: res4.insertId,
                                  productInfo: productInfo,
                                },
                              });
                            } else {
                              console.log(err3);
                              res.status(500).json({
                                status: false,
                                message: "Internal Server Error !",
                                client: { err3 },
                              });
                            }
                          }
                        );
                      } else {
                        console.log(err4);
                        res.status(500).json({
                          status: false,
                          message: "Internal Server Error !",
                          client: { err4 },
                        });
                        return;
                      }
                    }
                  );
                } else {
                  var perPrice =
                    res2[0].product_total_price / res2[0].product_quantity;
                  var alreadyQuery =
                    "UPDATE `order_details` SET `product_quantity` = ?, `product_total_price` = ? WHERE `order_details`.`order_details_id` = ?";

                  // Already in cart
                  db.query(
                    alreadyQuery,
                    [
                      res2[0].product_quantity + 1,
                      res2[0].product_total_price + perPrice,
                      res2[0].order_details_id,
                    ],
                    (err4, res4) => {
                      if (!err4) {
                        // Fetch product info
                        db.query(
                          "SELECT * FROM `products` WHERE `products`.`product_id` = ?",
                          [product_id],
                          (err3, res3) => {
                            if (!err3) {
                              const productInfo = res3[0];
                              res.status(200).json({
                                status: true,
                                message: `Successfully Updated Product: ${res2[0].order_details_id} in Cart: ${order_id}`,
                                client: {
                                  order_id: order_id,
                                  orderDetailsId: res2[0].order_details_id,
                                  productQuantity: res2[0].product_quantity + 1,
                                  productPrice:
                                    res2[0].product_total_price + perPrice,
                                  productInfo: productInfo,
                                },
                              });
                            } else {
                              console.log(err3);
                              res.status(500).json({
                                status: false,
                                message: "Internal Server Error !",
                                client: { err3 },
                              });
                            }
                          }
                        );
                      } else {
                        console.log(err4);
                        res.status(500).json({
                          status: false,
                          message: "Internal Server Error !",
                          client: { err4 },
                        });
                        return;
                      }
                    }
                  );
                }
              } else {
                console.log(err2);
                res.status(500).json({
                  status: false,
                  message: "Internal Server Error !",
                  client: { err2 },
                });
                return;
              }
            }
          );
        } else {
          console.log(err1);
          res.status(500).json({
            status: false,
            message: "Internal Server Error !",
            client: { err1 },
          });
          return;
        }
      }
    );
  }

  db.query(
    "SELECT * FROM `orders` WHERE `order_id` = ?",
    [order_id],
    (errPid, resPid) => {
      if (!errPid) {
        if (order_id == undefined) {
          addCart();
        } else if (order_id != undefined && resPid[0].seller_id == seller_id) {
          addCart();
        } else {
          res.status(200).json({
            status: false,
            message:
              "You have products in your cart from different seller ! Complete it first or cancel the Order !",
            client: {},
          });
          return;
        }
      } else {
        console.log(errPid);
        res.status(500).json({
          status: false,
          message: "Internal Server Error !",
          client: { errPid },
        });
        return;
      }
    }
  );
};

exports.delCart = (req, res) => {
  var oID = req.query.order_details_id;
  db.query(
    "DELETE FROM order_details WHERE `order_details`.`order_details_id` = ?",
    [oID],
    (err1, result) => {
      if (!err1) {
        if (result.affectedRows === 0) {
          res.status(200).json({
            status: false,
            message: `No product was deleted or no product with this ID: ${oID}`,
            client: { result },
          });
        } else {
          res.status(200).json({
            status: true,
            message: `Successfully Product Deleted from Order/Cart: ${oID}`,
            client: { result },
          });
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
};

exports.updateCart = (req, res) => {
  var { orderDetailsId, quantity, price } = req.body;

  db.query(
    "UPDATE `order_details` SET `product_quantity` = ?, `product_total_price` = ? WHERE `order_details`.`order_details_id` = ?",
    [quantity, price, orderDetailsId],
    (err1, result1) => {
      if (!err1) {
        if (result1.affectedRows === 0) {
          res.status(200).json({
            status: false,
            message: `No order details were updated for order details ID: ${orderDetailsId}`,
            client: { result1 },
          });
        } else {
          db.query(
            "SELECT `products`.*, `extra_cat`.*, `order_details`.`order_details_id`,orders.* FROM products INNER JOIN `order_details` ON `order_details`.`product_id` = `products`.`product_id` INNER JOIN `orders` ON `orders`.`order_id` = `order_details`.`order_id` INNER JOIN `extra_cat` ON `extra_cat`.`extra_cat_id` = `products`.`product_cat_id` WHERE `order_details`.`order_details_id` = ?",
            [orderDetailsId],
            (err2, result2) => {
              if (!err2) {
                db.query(
                  "UPDATE `products` SET `sell_count` = ? WHERE `products`.`product_id` = ?",
                  [result2[0].sell_count + 1, result2[0].product_id],
                  (err3, result3) => {
                    if (!err3) {
                      res.status(200).json({
                        status: true,
                        message: `Successfully Updated Order for Product no: ${result2[0].product_id}`,
                        client: {
                          product_quantity: quantity,
                          price: price,
                          productInfo: result2,
                        },
                      });
                    } else {
                      console.log(err3);
                      res.status(500).json({
                        status: false,
                        message: "Internal Server Error!",
                        client: { err3 },
                      });
                    }
                  }
                );
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
        }
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

// exports.updateCart = (req, res) => {
//   var { orderDetailsId, quantity, price } = req.body;

//   db.query(
//     "UPDATE `order_details` SET `product_quantity` = ?, `product_total_price` = ? WHERE `order_details`.`order_details_id` = ?",
//     [quantity, price, orderDetailsId],
//     (err1, result1) => {
//       if (!err1) {
//         if (result1.affectedRows === 0) {
//           res.status(200).json({
//             status: false,
//             message: `No order details were updated for order details ID: ${orderDetailsId}`,
//             client: { result1 },
//           });
//         } else {
//           db.query(
//             "SELECT * FROM `products` INNER JOIN `order_details` ON `order_details`.`product_id` = `products`.`product_id` INNER JOIN `extra_cat` ON `extra_cat`.`extra_cat_id` = `products`.`product_cat_id` WHERE `order_details`.`order_details_id` = ?",
//             [orderDetailsId],
//             (err2, result2) => {
//               if (!err2) {
//                 db.query(
//                   "UPDATE `products` SET `sell_count` = ? WHERE `products`.`product_id` = ?",
//                   [result2[0].sell_count + 1, result2[0].product_id],
//                   (err3, result3) => {
//                     if (!err3) {
//                       res.status(200).json({
//                         status: true,
//                         message: `Successfully Updated Order for Product no: ${result2[0].product_id}`,
//                         client: { quantity, price },
//                       });
//                     } else {
//                       console.log(err3);
//                       res.status(500).json({
//                         status: false,
//                         message: "Internal Server Error!",
//                         client: { err3 },
//                       });
//                     }
//                   }
//                 );
//               } else {
//                 console.log(err2);
//                 res.status(500).json({
//                   status: false,
//                   message: "Internal Server Error!",
//                   client: { err2 },
//                 });
//               }
//             }
//           );
//         }
//       } else {
//         console.log(err1);
//         res.status(500).json({
//           status: false,
//           message: "Internal Server Error!",
//           client: { err1 },
//         });
//       }
//     }
//   );
// };

exports.placeOrder = (req, res) => {
  var oID = req.query.order_id;

  db.query(
    "UPDATE `orders` SET `in_cart` = '0' WHERE `orders`.`order_id` = ?",
    [oID],
    (err1, result1) => {
      if (!err1) {
        if (result1.affectedRows === 0) {
          res.status(200).json({
            status: true,
            message: `No order was placed for order no: ${oID}`,
            client: { result1 },
          });
        } else {
          db.query(
            "SELECT `products`.`product_id`, `products`.`product_name`, `products`.`product_price`, `products`.`product_short_des`, `products`.`product_details_des`, `products`.`product_cat_id`,`products`.`seller_id`,`products`.`sell_count`, `extra_cat`.*, order_details.order_details_id, order_details.product_total_price, order_details.product_quantity, orders.* FROM products INNER JOIN order_details ON order_details.product_id = products.product_id INNER JOIN orders ON orders.order_id = order_details.order_id INNER JOIN `extra_cat` ON `extra_cat`.`extra_cat_id` = `products`.`product_cat_id` WHERE orders.order_id = ?",
            [oID],
            (err2, result2) => {
              if (!err2) {
                res.status(200).json({
                  status: true,
                  message: `Successfully Placed Order. Order no: ${oID}`,
                  client: { order_details: result2 },
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
        }
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

exports.deliveryAddress = (req, res) => {
  const { division, district, thana, deliveryNumber, areaName } = req.body;

  var orderDetailsId = req.query.order_details_id;
  var oID = req.query.order_id;
  const addressDetails = {
    division,
    district,
    thana,
    deliveryNumber,
    areaName,
  };
  const address = JSON.stringify(addressDetails);

  db.query(
    "UPDATE `orders` SET `address` = ? WHERE `orders`.`order_id` = ?",
    [address, oID],
    (err1, result1) => {
      if (!err1) {
        if (result1.affectedRows === 0) {
          res.status(200).json({
            status: false,
            message: `No Result was found to update for order no: ${oID}`,
            client: { result1 },
          });
        } else {
          db.query(
            "SELECT `products`.`product_id`, `products`.`product_name`, `products`.`product_price`, `products`.`product_short_des`, `products`.`product_details_des`, `products`.`product_cat_id`,`products`.`seller_id`,`products`.`sell_count`, `extra_cat`.*, order_details.order_details_id, order_details.product_total_price, order_details.product_quantity, orders.* FROM products INNER JOIN order_details ON order_details.product_id = products.product_id INNER JOIN orders ON orders.order_id = order_details.order_id INNER JOIN `extra_cat` ON `extra_cat`.`extra_cat_id` = `products`.`product_cat_id` WHERE orders.order_id = ?",
            [oID],
            (err2, result2) => {
              if (!err2) {
                res.status(200).json({
                  status: true,
                  message: `Successfully Updated Delivery Address for order no: ${oID}`,
                  client: {
                    addressDetails,
                    order_id: oID,
                    productInfo: result2,
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
        }
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

exports.cancelOrder = (req, res) => {
  var oID = req.query.order_id;
  db.query(
    "DELETE FROM `order_details` WHERE `order_details`.`order_id` = ?",
    [oID],
    (err2, result2) => {
      if (!err2) {
        if (result2.affectedRows === 0) {
          res.status(200).json({
            status: false,
            message: `No order PRODUCTS were canceled for order no: ${oID}`,
            client: { result2 },
          });
        } else {
          db.query(
            "DELETE FROM `orders` WHERE `orders`.`order_id` = ?",
            [oID],
            (err1, result1) => {
              if (!err1) {
                if (result1.affectedRows === 0) {
                  res.status(200).json({
                    status: false,
                    message: `No ORDER was canceled with order ID: ${oID}`,
                    client: { result1 },
                  });
                } else {
                  res.status(200).json({
                    status: true,
                    message: `Successfully canceled order no: ${oID}`,
                    client: { result1 },
                  });
                }
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
        }
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
};
