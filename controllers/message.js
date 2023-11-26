const db = require("../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../config/helper");

exports.getMessage = async (req, res, next) => {
  try {
    db.beginTransaction(async (err) => {
      if (err) {
        return res.status(503).json({
          status: false,
          message: "Internal Server Error",
          message: [],
        });
      }
      try {
        const get_message_query = `SELECT 
  *,
  CASE
    WHEN status = 1 THEN 'pin'
    WHEN status = 0 THEN 'unpin'
    ELSE 'unknown'
  END AS status
FROM message;`;

        const messages_data = await queryAsync(get_message_query);
        if (messages_data.length === 0) {
          return res.status(200).json({
            status: false,
            message: "No message found",
            message: [],
          });
        }
        db.commit((err) => {
          if (err) {
            db.rollback(() => {
              return res.status(500).json({
                status: false,
                message: "Failed to find message data",
                message: [],
              });
            });
          }
          return res.status(200).json({
            status: true,
            message: "",
            message: messages_data,
          });
        });
      } catch (e) {
        console.log(e);
        return res.status(503).json({
          status: false,
          message: "Internal Server Error",
          message: [],
        });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({
      status: false,
      message: "Internal Server Error",
      message: [],
    });
  }
};
