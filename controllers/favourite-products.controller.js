const db = require("../config/database.config");

exports.getWishlist = (req, res) => {
  const uid = req.query.userId;
  db.query(
    "SELECT * FROM `wishlist` INNER JOIN `products` ON `wishlist`.`product_id` = `products`.`product_id` INNER JOIN `product_image` ON `product_image`.`product_id` = `wishlist`.`product_id` WHERE  `wishlist`.`user_id` = 1 AND `product_image`.`featured_image` = 1 ORDER BY `wishlist`.`wishlist_id` DESC",
    [uid],
    (err1, wishlist) => {
      if (!err1) {
        res.status(200).json({
          status: true,
          message: `Successfully fetched wishlist of User : ${uid}`,
          client: {
            wishlist,
          },
        });
      } else {
        console.log(err1);
        res.status(500).json({
          status: false,
          message: "Internal Server Error!",
          client: { err1 },
        });
        return
      }
    }
  );
};

exports.addWishlist = (req, res) => {
  const { product_id, user_id } = req.query;

  db.query(
    "SELECT * FROM `wishlist` WHERE `user_id` = ? AND `product_id` = ?",
    [user_id, product_id],
    (err1, res1) => {
      if (!err1) {
        if (res1.length > 0) {
          res.status(200).json({
            status: false,
            message: "Product is already in the wishlist.",
            client: { wishlist: res1 },
          });
        } else {
          db.query(
            "INSERT INTO `wishlist` (`user_id`, `product_id`) VALUES (?, ?)",
            [user_id, product_id],
            (err2, res2) => {
              if (!err2) {
                res.status(200).json({
                  status: true,
                  message: "Product added to the wishlist successfully.",
                  client: { res2 },
                });
              } else {
                console.error(err2);
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
        console.error(err1);
        res.status(500).json({
          status: false,
          message: "Internal Server Error!",
          client: { err1 },
        });
      }
    }
  );
};




exports.delWishlist = (req, res) => {
  const { wishlist_id } = req.query;
  db.query("DELETE FROM `wishlist` WHERE `wishlist`.`wishlist_id` = ?", [wishlist_id],
  (err1, res1)=>{
    if (!err1) {
      res.status(200).json({
        status: true,
        message: `Successfully product deleted ${wishlist_id} from the wishlist.`,
        client: { wishlist_id },
      });
    } else {
      console.error(err1);
      res.status(500).json({
        status: false,
        message: "Internal Server Error!",
        client: { err1 },
      });
    }
  })
}
