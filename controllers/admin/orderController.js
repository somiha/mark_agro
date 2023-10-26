const db = require("../../config/database.config");
const { queryAsync, queryAsyncWithoutValue } = require("../../config/helper");

exports.getAllOrders = async (req, res, next) => {
  try {
    const orderQuery = `SELECT
    o.order_id,
    o.placed_date,
    o.delivery_date,
    s.status_name,
    GROUP_CONCAT(p.product_name ORDER BY od.order_details_id) AS product_names,
    SUM(od.product_total_price) AS total_product_price,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'product_name', p.product_name,
            'product_quantity', od.product_quantity,
            'product_price', p.product_price,
            'product_image', i.product_image_url
        )
    ) AS product_details
FROM
    orders o
JOIN
    order_details od ON o.order_id = od.order_id
JOIN
    products p ON od.product_id = p.product_id
JOIN
    status s ON o.order_status = s.status_id
JOIN
    product_image i ON p.product_id = i.product_id
WHERE
    i.featured_image = 1
GROUP BY
    o.order_id, s.status_name;
`;

    const orders = await queryAsyncWithoutValue(orderQuery);

    const page = parseInt(req.query.page) || 1;
    const ordersPerPage = 8;
    const startIdx = (page - 1) * ordersPerPage;
    const endIdx = startIdx + ordersPerPage;
    const paginatedOrders = orders.slice(startIdx, endIdx);
    return res.status(200).render("pages/order", {
      title: "All Order",
      orders,
      paginatedOrders,
      ordersPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
