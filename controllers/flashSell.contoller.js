const { query } = require("express");
const db = require("../config/database.config");
const catModel = require("../middlewares/cat");

exports.startScreen = (req, res) => {
  db.query("SELECT * FROM `flashsell`", (err1, res1)=>{
    if (!err1) {
      res.status(200).json({
        status: true,
        message: `Successfully Fetched Flash Sells Images`,
        client: {
          pages: res1,
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
  })
};