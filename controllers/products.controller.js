const db = require("../config/database.config");
const catModel = require("../middlewares/cat");

exports.products = async (req, res) => {
  try {
    const currencyCode = req.cookies.currencyCode;
    const [currRate] = await Promise.all([
    catModel.fetchCurrencyRate(currencyCode),
    ]);
    var uID = req.cookies.userId;
    var isLogged = req.cookies.login_status;
    var userName = req.cookies.userName;
    var userImage = req.cookies.userImage;
    if (isLogged) {
      db.query(
        "SELECT * FROM `products` INNER JOIN `shop` ON `shop`.`id` = `products`.`seller_id` WHERE `shop`.`seller_user_id` = ?",
        [uID],
        (err1, res1) => {
          if (!err1) {
            db.query("SELECT * FROM `products` INNER JOIN `shop` ON `shop`.`id` = `products`.`seller_id` INNER JOIN `product_image` ON `products`.`product_id` = `product_image`.`product_id` WHERE `shop`.`seller_user_id` = ? AND `product_image`.`featured_image` = 1", [uID],
              (err2, res2) => {
                if (!err2) {
                  res.render("products", {
                    currRate,
                    currencyCode,
                    userName: userName,
                    userImage: userImage,
                    menuId: "shop-owner-products",
                    products: res1,
                    images: res2
                  });
                } else {
                  res.send(err2)
                }
              })
          } else {
            res.send(err1);
          }
        }
      );
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
    // Handle error and send appropriate response
    res.status(500).send("Internal Server Error");
  }
};

exports.filter_unpublished = (req, res) => {
  var uID = req.cookies.userId;
  var isLogged = req.cookies.login_status;
  if (isLogged) {
    db.query(
      "SELECT * FROM `products` INNER JOIN `shop` ON `shop`.`id` = `products`.`seller_id` INNER JOIN `product_image` ON `products`.`product_id` = `product_image`.`product_id` WHERE `shop`.`seller_user_id` = ? AND `products`.`quantity`= -1",
      [uID],
      (err1, res1) => {
        if (!err1) {
          db.query("SELECT * FROM `products` INNER JOIN `shop` ON `shop`.`id` = `products`.`seller_id` INNER JOIN `product_image` ON `products`.`product_id` = `product_image`.`product_id` WHERE `shop`.`seller_user_id` = ? AND `product_image`.`featured_image` = 1", [uID],
              (err2, res2) => {
                if (!err2) {
                  res.render("products", {
                    menuId: "shop-owner-products",
                    products: res1,
                    images: res2
                  })
                } else {
                  res.send(err2);
                }
            });
        } else {
          res.send(err1);
        }
      }
    );
  } else {
    res.redirect("/login");
  }
};

exports.filter_published = (req, res) => {
  var uID = req.cookies.userId;
  var isLogged = req.cookies.login_status;
  var userImage = req.cookies.userImage;
  if (isLogged) {
    db.query(
      "SELECT * FROM `products` INNER JOIN `shop` ON `shop`.`id` = `products`.`seller_id` INNER JOIN `product_image` ON `products`.`product_id` = `product_image`.`product_id` WHERE `shop`.`seller_user_id` = ? AND NOT `products`.`quantity`= -1",
      [uID],
      (err1, res1) => {
        if (!err1) {
          db.query("SELECT * FROM `products` INNER JOIN `shop` ON `shop`.`id` = `products`.`seller_id` INNER JOIN `product_image` ON `products`.`product_id` = `product_image`.`product_id` WHERE `shop`.`seller_user_id` = ? AND `product_image`.`featured_image` = 1", [uID],
              (err2, res2) => {
                if (!err2) {
                  res.render("products", {
                    menuId: "shop-owner-products",
                    products: res1,
                    images: res2,
                    userImage: userImage
                  })
                } else {
                  res.send(err2);
                }
            });
        } else {
          res.send(err1);
        }
      }
    );
  } else {
    res.redirect("/login");
  }
};

exports.del_product = (req, res) => {
  var pID = req.params.id;
  var query = "DELETE FROM `products` WHERE `products`.`product_id` = ?";
  console.log("Delete product id : " + pID);
  db.query(query, [pID], (err1, res1) => {
    if (!err1) {
      db.query(
        "DELETE FROM `product_image` WHERE `product_image`.`product_id` = ?",
        [pID],
        (err2, res2) => {
          if (!err2) {
            db.query("DELETE FROM `product_video` WHERE `product_id` = ?", [pID], (err3, res3)=>{
              if (!err3) {
                res.redirect("/products");
              } else {
                res.send(err3)
              }
            })
          } else {
            res.send(err2);
          }
        }
      );
    } else {
      res.send(err1);
    }
  });
};

exports.unpublish_product = (req, res) => {
  var product_id = req.params.product_id;
  db.query(
    "UPDATE `products` SET `quantity` = '-1' WHERE `products`.`product_id` = ?",
    [product_id],
    (err1, res1) => {
      if (!err1) {
        res.redirect("/products");
      } else {
        res.send(err1);
      }
    }
  );
};

exports.publish_product = (req, res) => {
  var product_id = req.params.product_id;
  var product_id = req.params.product_id;
  db.query(
    "UPDATE `products` SET `quantity` = '0' WHERE `products`.`product_id` = ?",
    [product_id],
    (err1, res1) => {
      if (!err1) {
        res.redirect("/products");
      } else {
        res.send(err1);
      }
    }
  );
};
