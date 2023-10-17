const db = require("../config/database.config");
const catModel = require("../middlewares/cat");

const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.regPost = async (req, res) => {
    var { name, email, password, phone } = req.body
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    db.query("SELECT * FROM `user` WHERE `user`.`phone` = ?", [phone], (err11, res11)=>{
        if (!err11) {
            if (res11.length <= 0) {
              var query = "INSERT INTO `user` (`user_id`, `user_name`, `user_email`, `user_password`, `phone`) VALUES (NULL, ?, ?, ?, ?)"
              db.query(query, [name, email, hashedPassword, phone], (err2, res2) => {
                if (!err2) {
                  res.status(200).json(
                    {
                      status: true,
                      message: 'Registration Successful. UID : ' + res2.insertId,
                    }
                  )
                } else {
                    res.send(err2)
                    res.status(500).json(
                      {
                        status: false,
                        message: 'Internal Server DB error. Registration Failed.',
                      }
                    )
                }
              })
              // var qr = "SELECT * FROM `user` WHERE `phone` = ?"
              // db.query(qr, [phone], (err1, res1) => {
              //     if (!err1) {
              //         var shop_name = username + "'s Shop"
              //         qr = "INSERT INTO `shop` (`id`, `seller_user_id`, `shop_name`, `shop_location_lt`, `shop_location_long`, `shop_number`, `shop_type`) VALUES (NULL, ?, ?, ?, ?, ?, ?) ";
              //         db.query(qr, [res1[0].user_id, shop_name, latitude, longitude, phone, 2], (err2, res2) => {
              //             if (!err2) {
              //                 console.log("Reg details : ", res1[0].user_id, shop_name, latitude, longitude, phone)
              //                 res.redirect("/login");
              //             } else {
              //                 res.send(err2)
              //             }
              //         })
              //     } else {
              //         res.send(err1)
              //     }
              // })
            } else {
              //
              res.status(200).json(
                {
                  status: false,
                  message: 'User Exists With The Number : ' + phone,
                }
              )
            }
        } else {
            console.log(err11)
            res.status(500).json(
              {
                status: false,
                message: 'Internal Server DB error',
              }
            )
        }
    })
}
