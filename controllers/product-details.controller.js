const db = require("../config/database.config");
const { products } = require("./products.controller");
const catModel = require("../middlewares/cat");


exports.productDetails = async (req, res) => {
  try {
    const [mainCat, subCat, extraCat, allCat, featuredImage ] = await Promise.all([
      catModel.fetchMainCat(),
      catModel.fetchSubCat(),
      catModel.fetchExtraCat(),
      catModel.fetchAllCat(),
      catModel.fetchFeaturedImages(),
    ]);
    var productID = req.query.id
    var query = "SELECT * FROM `products` INNER JOIN `extra_cat` ON `products`.`product_cat_id` = `extra_cat`.`extra_cat_id`  WHERE `products`.`product_id` = ?"
    db.query(query, [productID], (err1, res1)=>{
      if (!err1) {
        db.query("SELECT * FROM `product_video` WHERE `product_id` = ?", [productID], (err5, res5)=>{
          if (!err5) {
          db.query("SELECT * FROM `product_image` WHERE `product_id` = ?", [productID], (err6, res6)=>{
            if (!err6) {
              if (res1[0].status == 1 && res1[0].admin_published == 1 && res1[0].quantity >= 0) {
                res.status(200).json({
                  status: true,
                  message: `Successfully Fetched ID: ${productID} Product Details`,
                  client: {
                    productInfo: res1,
                    productVideo: res5,
                    productImages: res6,
                  },
                });
              } else {
                res.status(200).json({
                  status: false,
                  message: `Product ID: ${productID} maybe not Published or status is not Approved`,
                  client: {},
                });
              }
            } else {
              res.status(500).json({
                status: false,
                message: `Product ID: ${productID} Image Load Error !`,
                client: {err6},
              });
            }
          })
          } else {
            res.status(500).json({
              status: false,
              message: `Product ID: ${productID} Video Load Error !`,
              client: {err5},
            });
          }
        })
      } else {
        res.status(500).json({
          status: false,
          message: `Product ID: ${productID} Product Details Load Error !`,
          client: {err1},
        });
      }
    })
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error !",
      client : {err}
    })
  }
};

exports.relatedProducts = async (req, res) => {
  try {
    const [mainCat, subCat, extraCat, allCat, featuredImage ] = await Promise.all([
      catModel.fetchMainCat(),
      catModel.fetchSubCat(),
      catModel.fetchExtraCat(),
      catModel.fetchAllCat(),
      catModel.fetchFeaturedImages(),
    ]);
    var catID = req.query.id
    db.query("SELECT * FROM `products` WHERE `product_cat_id` = ?", [catID],
    (err1, res1)=>{
      if (!err1) {
        res.status(200).json({
          status: true,
          message: "Successfully Fetched Related Products !",
          client: {
            relatedProducts: res1,
            featuredImages: featuredImage,
          }
        })
      } else {
        console.log(err1)
        res.status(500).json({
          status: false,
          message: "Internal Server Error !",
          client : {err1}
        })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: false,
      message: "Internal Server Error !",
      client : {err}
    })
  }
}