const { log } = require("console");
const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const fs = require("fs");
const path = require("path");
const baseUrl = process.env.baseUrl;

exports.getEditor = async (req, res, next) => {
  try {
    const editorQuery = `SELECT r.role, a.username, a.password, a.admin_id, a.role_id
FROM admin_role r
JOIN admin_info a ON r.role_id = a.role_id
WHERE r.role = 'Editor';

`;

    const editors = await queryAsyncWithoutValue(editorQuery);

    const page = parseInt(req.query.page) || 1;
    const adminPerPage = 8;
    const startIdx = (page - 1) * adminPerPage;
    const endIdx = startIdx + adminPerPage;
    const paginatedAdmin = editors.slice(startIdx, endIdx);
    return res.status(200).render("pages/editor", {
      title: "Editors",
      editors,
      paginatedAdmin,
      adminPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.postEditor = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const insertEditorQuery =
      "INSERT INTO admin_info (role_id, username, password) VALUES (3, ?, ?)";
    const editorValues = [username, password];

    db.query(insertEditorQuery, editorValues, (err, result) => {
      if (err) {
        throw err;
      }

      const editorId = result.insertId;

      return res.redirect("/editor");
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updateEditor = async (req, res, next) => {
  try {
    const { edit_id, edit_username, edit_password } = req.body;

    const updateEditorQuery =
      "UPDATE admin_info SET username = ?, password = ? WHERE admin_id = ?";
    const editorValues = [edit_username, edit_password, edit_id];

    db.query(updateEditorQuery, editorValues, (err, result) => {
      if (err) {
        throw err;
      }

      return res.redirect("/editor");
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteEditor = async (req, res, next) => {
  try {
    const { id } = req.query;
    const deleteEditor = `DELETE FROM admin_info WHERE admin_id = ${id}`;
    await queryAsyncWithoutValue(deleteEditor);
    res.redirect("/editor");
  } catch (err) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
