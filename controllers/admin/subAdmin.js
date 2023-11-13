const { log } = require("console");
const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const fs = require("fs");
const path = require("path");
const baseUrl = process.env.baseUrl;

exports.getSubAdmin = async (req, res, next) => {
  try {
    const subAdminQuery = `SELECT r.role, a.username, a.password, a.admin_id, a.role_id
FROM admin_role r
JOIN admin_info a ON r.role_id = a.role_id
WHERE r.role = 'Sub Admin';

`;

    const subAdmins = await queryAsyncWithoutValue(subAdminQuery);

    const page = parseInt(req.query.page) || 1;
    const adminPerPage = 8;
    const startIdx = (page - 1) * adminPerPage;
    const endIdx = startIdx + adminPerPage;
    const paginatedAdmin = subAdmins.slice(startIdx, endIdx);
    return res.status(200).render("pages/subAdmin", {
      title: "SubAdmins",
      subAdmins,
      paginatedAdmin,
      adminPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.postSubAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const insertSubAdminQuery =
      "INSERT INTO admin_info (role_id, username, password) VALUES (2, ?, ?)";
    const subAdminValues = [username, password];

    db.query(insertSubAdminQuery, subAdminValues, (err, result) => {
      if (err) {
        throw err;
      }

      const subAdminId = result.insertId;

      return res.redirect("/sub-admin");
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updateSubAdmin = async (req, res, next) => {
  try {
    const { edit_id, edit_username, edit_password } = req.body;

    const updateSubAdminQuery =
      "UPDATE admin_info SET username = ?, password = ? WHERE admin_id = ?";
    const subAdminValues = [edit_username, edit_password, edit_id];

    db.query(updateSubAdminQuery, subAdminValues, (err, result) => {
      if (err) {
        throw err;
      }

      return res.redirect("/sub-admin");
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteSubAdmin = async (req, res, next) => {
  try {
    const { id } = req.query;
    const deleteSubAdmin = `DELETE FROM admin_info WHERE admin_id = ${id}`;
    await queryAsyncWithoutValue(deleteSubAdmin);
    res.redirect("/sub-admin");
  } catch (err) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
