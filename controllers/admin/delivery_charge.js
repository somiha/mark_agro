const { log } = require("console");
const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");
const fs = require("fs");
const path = require("path");
const baseUrl = process.env.baseUrl;

exports.getCharges = async (req, res, next) => {
  try {
    const chargeQuery = `SELECT * FROM delivery_charge`;
    const charges = await queryAsyncWithoutValue(chargeQuery);
    const page = parseInt(req.query.page) || 1;
    const chargesPerPage = 8;
    const startIdx = (page - 1) * chargesPerPage;
    const endIdx = startIdx + chargesPerPage;
    const paginatedCharges = charges.slice(startIdx, endIdx);
    return res.status(200).render("pages/delivery_charge", {
      title: "Charges",
      charges,
      paginatedCharges,
      chargesPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.postCharge = async (req, res, next) => {
  try {
    const { location, charge } = req.body;

    const insertChargeQuery =
      "INSERT INTO delivery_charge (location, charge) VALUES (?, ?)";
    const chargeValues = [location, charge];

    db.query(insertChargeQuery, chargeValues, (err, result) => {
      if (err) {
        throw err;
      }

      const chargeId = result.insertId;

      return res.redirect("/charges");
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updateCharge = async (req, res, next) => {
  try {
    const { delivery_id, edit_location, edit_charge } = req.body;
    console.log(req.body);

    const updateChargeQuery =
      "UPDATE delivery_charge SET location = ?, charge = ? WHERE delivery_id = ?";
    const chargeValues = [edit_location, edit_charge, delivery_id];

    db.query(updateChargeQuery, chargeValues, (err, result) => {
      if (err) {
        throw err;
      }

      return res.redirect("/charges");
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteCharges = async (req, res, next) => {
  try {
    const { id } = req.query;
    const deleteCharge = `DELETE FROM delivery_charge WHERE delivery_id = ${id}`;
    await queryAsyncWithoutValue(deleteCharge);
    res.redirect("/charges");
  } catch (e) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
