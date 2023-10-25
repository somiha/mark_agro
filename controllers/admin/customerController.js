const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customerQuery = `SELECT
    user.*,
    COALESCE(COUNT(orders.order_id), 0) AS total_orders
FROM
    user
LEFT JOIN
    orders ON user.user_id = orders.user_id
GROUP BY
    user.user_id;
`;
    const customers = await queryAsyncWithoutValue(customerQuery);
    const page = parseInt(req.query.page) || 1;
    const customersPerPage = 8;
    const startIdx = (page - 1) * customersPerPage;
    const endIdx = startIdx + customersPerPage;
    const paginatedCustomers = customers.slice(startIdx, endIdx);
    return res.status(200).render("pages/allCustomers", {
      title: "All Customer",
      customers,
      paginatedCustomers,
      customersPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
