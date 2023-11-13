const { log } = require("console");
const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const fs = require("fs");
const path = require("path");
const baseUrl = process.env.baseUrl;

exports.getMessages = async (req, res, next) => {
  try {
    const bannerQuery = `SELECT *
              FROM message
              ORDER BY status DESC, updated_at DESC;`;

    const messages = await queryAsyncWithoutValue(bannerQuery);
    const info = messages[0].info;
    const page = parseInt(req.query.page) || 1;
    const messagesPerPage = 8;
    const startIdx = (page - 1) * messagesPerPage;
    const endIdx = startIdx + messagesPerPage;
    const paginatedMessages = messages.slice(startIdx, endIdx);
    return res.status(200).render("pages/message", {
      title: "Messages",
      messages,
      paginatedMessages,
      messagesPerPage,
      page,
      info,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.postMessage = async (req, res, next) => {
  try {
    const { title, info, status } = req.body;

    const insertMessageQuery =
      "INSERT INTO message (title, info, status) VALUES (?, ?, ?)";
    const messageValues = [title, info, status];

    db.query(insertMessageQuery, messageValues, (err, result) => {
      if (err) {
        throw err;
      }

      const messageId = result.insertId;

      return res.redirect("/messages");
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updateMessage = async (req, res, next) => {
  try {
    const { edit_id, edit_title, edit_info, edit_status } = req.body;

    const updateMessageQuery =
      "UPDATE message SET title = ?, info = ?, status = ? WHERE message_id = ?";
    const messageValues = [edit_title, edit_info, edit_status, edit_id];

    db.query(updateMessageQuery, messageValues, (err, result) => {
      if (err) {
        throw err;
      }

      return res.redirect("/messages");
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.query;
    const deleteMessage = `DELETE FROM message WHERE message_id = ${id}`;
    await queryAsyncWithoutValue(deleteMessage);
    res.redirect("/messages");
  } catch (err) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
