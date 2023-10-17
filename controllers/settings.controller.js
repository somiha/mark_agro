const db = require("../config/database.config");
const multer = require("multer");
const multerCon = require("../config/multer.config");

var shop;
db.query("SELECT * FROM `shop_type`", (err, res) => {
  if (!err) {
    shop = res;
  }
});

exports.userProfile = (req, res) => {
  var {userId} = req.query
  db.query(
    "SELECT * FROM `user` WHERE `user_id` = ?",
    [userId], (err1, res1) => {
      if (!err1) {
        res.status(200).json({
          status: true,
          message: `Successfully Fetched Details of User : ${userId}`,
          client: {
            userInfo: res1[0],
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

exports.editProfile = (req, res) => {
  //  IF no changes made then just overwritten previous info
  var { name, email, phone, date_of_birth, gender } = req.body;
  var uID = req.query.userId;
  var query = "UPDATE `user` SET `user_name` = ?, `user_email` = ?, `phone` = ?, `date_of_birth` = ?, `gender`=? WHERE `user`.`user_id` = ?";
  db.query(query, [name, email, phone, date_of_birth, gender, uID], (err1, res1) => {
    if (!err1) {
      res.status(200).json({
        status: true,
        message: `Successfully Updated Details of User : ${uID}`,
        client: {
          name, email, phone, date_of_birth, gender,
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
  });
};



exports.picEdit = (req, res) => {
  const upload = multerCon.single("user_img");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.send(err);
    } else if (err) {
      res.send(err);
    }
    if (!req.file) {
      // No picture uploaded
      console.log(err);
      res.status(200).json({
        status: false,
        message: "No pic was selected !",
        client: { err },
      });
      return
    }

    var pic_url = "http://localhost:3000/images/userImg/" + req.file.filename;

    var uID = req.query.userId;
    var query = "UPDATE `user` SET `pic_url` = ? WHERE `user`.`user_id` = ?";
    db.query(query, [pic_url, uID], (err1, res1) => {
      if (!err1) {
        res.status(200).json({
          status: true,
          message: `Successfully Updated Photo of User : ${uID}`,
          client: {
            pic_url,
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
    });
  });
};

