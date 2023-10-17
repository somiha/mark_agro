const db = require("../config/database.config");
const catModel = require("../middlewares/cat");


exports.allCategory = async (req, res) => {

  try {
    const [mainCat, subCat, extraCat, allCat, images] = await Promise.all([
      catModel.fetchMainCat(),
      catModel.fetchSubCat(),
      catModel.fetchExtraCat(),
      catModel.fetchAllCat(),
      catModel.fetchFeaturedImages(),
    ]);
      res.status(200).json({
        status: true,
        message: "Successfully Fetched All Categories !",
        client : {
          mainCat: mainCat,
          subCat: subCat,
          extraCat: extraCat,
          // allCat: allCat,
          productInfo: images,
        },
      })
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error !",
      client : {err}
    })
  }
};