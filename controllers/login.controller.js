const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../config/database.config");
const catModel = require("../middlewares/cat");

exports.loginPost = (req, res) => {
  var { phone, password } = req.body;
  let myPromise = new Promise(function (myResolve, myReject) {
    db.query(
      "SELECT * FROM `user` WHERE `phone` = ?;",
      [phone],
      async function (error, result) {
        if (!error) {
          console.log(phone, password);
          myResolve(result);
        }
        myReject(error);
      }
    );
  });

  myPromise.then(
    async function (result) {
      if (result.length > 0) {
        const hashedPasswordFromDB = result[0].user_password;
        const match = await bcrypt.compare(password, hashedPasswordFromDB);
        if (match) {
          return res.status(200).json({
            status: true,
            message: "Successfully LogIn. UID : " + result[0].user_id,
            client: {
              user_info: result[0],
            },
          });
        } else {
          return res.status(200).json({
            status: false,
            message: "Wrong password. The password you entered does not match.",
            client: {},
          });
        }
      } else {
        return res.status(200).json({
          status: false,
          message: "No User with this number",
          client: {},
        });
      }
    },
    function (error) {
      console.log(error);
      return res
        .status(503)
        .json({ status: false, message: "Internal Server Error", client: {} });
    }
  );
};

exports.logout = (req, res) => {
  Object.keys(req.cookies).forEach((cookie) => {
    res.clearCookie(cookie);
  });
  res.redirect("/login");
};

exports.numberVerify = (req, res) => {
  const { number } = req.body;
  db.query("SELECT * FROM `user` WHERE `phone` = ?", [number], (err1, res1) => {
    if (!err1) {
      if (res1.length > 0) {
        res.send("success");
      } else {
        res.send("failed");
      }
    } else {
      res.send(err1);
    }
  });
};

exports.passReset = (req, res) => {
  var { oldPassword, newPassword, confirmPass } = req.body;
  var { number } = req.query;

  if (newPassword != confirmPass) {
    res.status(200).json({
      status: false,
      message: "New Pass and Confirm Pass didn't match !",
      client: {},
    });
    return;
  }

  if (newPassword === oldPassword) {
    res.status(200).json({
      status: false,
      message: "Please use new password",
      client: {},
    });
    return;
  }

  let myPromise = new Promise(function (myResolve, myReject) {
    db.query(
      "SELECT * FROM `user` WHERE `phone` = ?;",
      [number],
      async function (error, result) {
        if (!error) {
          myResolve(result);
        } else {
          myReject(error);
        }
      }
    );
  });

  myPromise.then(
    async function (result) {
      console.log("Query Result: ", result);
      if (result.length > 0) {
        const userId = result[0].user_id;
        const hashedPasswordFromDB = result[0].user_password;

        const match = await bcrypt.compare(oldPassword, hashedPasswordFromDB);
        if (match) {
          const hashedPassword = await bcrypt.hash(newPassword, 10);

          db.query(
            "UPDATE `user` SET `user_password` = ? WHERE `user_id` = ?",
            [hashedPassword, userId],
            (error, response) => {
              if (!error) {
                console.log("Password reset successful for User ID: " + userId);
                db.query(
                  "SELECT * FROM `user` WHERE `user`.`user_id` = ?",
                  [userId],
                  (err2, res2) => {
                    if (!err2) {
                      res.status(200).json({
                        status: true,
                        message: "Password Reset Successful !",
                        client: { user_info: res2[0] },
                      });
                    } else {
                      res.status(500).json({
                        status: false,
                        message:
                          "Internal Server DB error. Registration Failed.",
                      });
                    }
                  }
                );
              } else {
                console.error("DB Update Error: ", error);
                res.status(500).json({
                  status: false,
                  message: "Password reset failed. DB error !",
                  client: {},
                });
                return;
              }
            }
          );
        } else {
          console.log("<Not Matched Pass>: ");
          res.status(200).json({
            status: false,
            message: "Old Password didn't matched. Password Reset Failed !",
            client: {},
          });
        }
        return;
      } else {
        console.log("no_user");
        res.status(200).json({
          status: false,
          message: "No User With This Number",
          client: {},
        });
        return;
      }
    },
    function (error) {
      console.error("Promise Error: ", error);
      res.status(500).json({
        status: false,
        message: "Internal Server Error !",
        client: {},
      });
    }
  );
};
