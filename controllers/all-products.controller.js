const db = require("../config/database.config");
const catModel = require("../middlewares/cat");

exports.allProducts = async (req, res) => {
  try {
    const [mainCat, subCat, extraCat, allProducts, fetchFeaturedImages] = await Promise.all([
      catModel.fetchMainCat(),
      catModel.fetchSubCat(),
      catModel.fetchExtraCat(),
      catModel.fetchAllProducts(),
      catModel.fetchFeaturedImages(),
    ]);
    res.status(200).json({
      status: true,
      message: "Successfully Fetched All Products",
      client: {
        productInfo: allProducts,
        featuredImages: fetchFeaturedImages,
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
};


exports.productsByCat = async (req, res) => {
  try {
    const [mainCat, subCat, extraCat, allProducts, fetchFeaturedImages] = await Promise.all([
      catModel.fetchMainCat(),
      catModel.fetchSubCat(),
      catModel.fetchExtraCat(),
      catModel.fetchAllProducts(),
      catModel.fetchFeaturedImages(),
    ]);
    var extraCatID = req.query.catID
    const filteredProducts = allProducts.filter(product => product.product_cat_id === extraCatID);

    if (filteredProducts.length > 0) {
      res.status(200).json({
        status: true,
        message: `Successfully Fetched ${extraCatID} Product`,
        client: {
          productInfo: filteredProducts,
          featuredImages: fetchFeaturedImages,
        }
      })
    } else {
      res.status(200).json({
        status: false,
        message: `No product of ID: ${extraCatID}`,
        client: {}
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
    status: false,
    message: "Internal Server Error !",
    client : {err}
    })
  }
};