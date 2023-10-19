// cat.js

const db = require("../config/database.config");

// Helper function for fetching main_cat data from the database
exports.fetchMainCat = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `main_cat` ORDER BY `main_cat`.`main_cat_name` ASC",
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

// Helper function for fetching sub_cat data from the database
exports.fetchSubCat = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `sub_cat` ORDER BY `sub_cat`.`sub_cat_name` ASC",
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.fetchExtraCat = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `extra_cat` ORDER BY `extra_cat`.`extra_cat_name` ASC, `extra_cat`.`popular_cat_value` DESC",
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.fetchAllCat = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `sub_cat` INNER JOIN `main_cat` ON `main_cat`.`main_cat_id` = `sub_cat`.`sub_cat_ref` INNER JOIN `extra_cat` ON `sub_cat`.`sub_cat_id` = `extra_cat`.`extra_cat_ref`",
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.fetchAllProducts = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM `products`", (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

exports.fetchFeaturedImages = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `product_image` WHERE `product_image`.`featured_image` = 1",
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.fetchProductVideos = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `products` INNER JOIN `product_image` ON `products`.`product_id` = `product_image`.`product_id` WHERE `product_image`.`featured_image` = 1",
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

exports.fetchProductVariants = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `products` INNER JOIN `variant` ON `products`.`product_id` = `variant`.`product_id`",
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};
