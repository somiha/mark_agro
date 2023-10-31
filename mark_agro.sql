-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306:3306
-- Generation Time: Oct 31, 2023 at 09:13 AM
-- Server version: 8.1.0
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mark_agro`
--

-- --------------------------------------------------------

--
-- Table structure for table `extra_cat`
--

CREATE TABLE `extra_cat` (
  `extra_cat_id` int NOT NULL,
  `extra_cat_ref` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `extra_cat_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `extra_cat_image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `popular_cat_value` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `extra_cat`
--

INSERT INTO `extra_cat` (`extra_cat_id`, `extra_cat_ref`, `extra_cat_name`, `extra_cat_image_url`, `popular_cat_value`) VALUES
(460, '99', 'iPhone', 'http://localhost:3000/uploads/extra-cat-image-1698654180190-pexels-jess-bailey-designs-788946.jpg', NULL),
(461, '100', 'Apple', 'http://localhost:3000/uploads/extra-cat-image-1698655475967-pexels-anna-nekrashevich-7214602.jpg', NULL),
(462, '100', 'Oranges', 'http://localhost:3000/uploads/extra-cat-image-1698661435626-pexels-pixabay-161559.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `flashsell`
--

CREATE TABLE `flashsell` (
  `flashSell_id` int NOT NULL,
  `flashSell_image_url` varchar(250) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flashsell`
--

INSERT INTO `flashsell` (`flashSell_id`, `flashSell_image_url`) VALUES
(1, 'test1.jpg'),
(2, 'test1.jpg'),
(3, 'test2.jpg'),
(4, 'test3.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `main_cat`
--

CREATE TABLE `main_cat` (
  `main_cat_id` int NOT NULL,
  `main_cat_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `main_cat_image_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `popular_cat_value` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `main_cat`
--

INSERT INTO `main_cat` (`main_cat_id`, `main_cat_name`, `main_cat_image_url`, `popular_cat_value`) VALUES
(86, 'Electronics', 'http://localhost:3000/uploads/main-cat-image-1698654118094-pexels-ovan-62689.jpg', NULL),
(87, 'Fruits and Vegitable', 'http://localhost:3000/uploads/main-cat-image-1698655347939-pexels-adonyi-gabor-1400172.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_status` int NOT NULL DEFAULT '1',
  `seller_id` int DEFAULT NULL,
  `placed_date` date DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `in_cart` int NOT NULL DEFAULT '1',
  `is_paid` int NOT NULL DEFAULT '0',
  `deliveryCharge` double DEFAULT '0',
  `address` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `return_reason` varchar(250) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'No Reason Said'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `order_status`, `seller_id`, `placed_date`, `delivery_date`, `in_cart`, `is_paid`, `deliveryCharge`, `address`, `return_reason`) VALUES
(90, 14, 5, 1, '2023-10-30', '2023-11-06', 1, 0, 0, '{\"division\":\"Rajshahi\",\"district\":\"Rajshahi\",\"thana\":\"Motihar\",\"deliveryNumber\":\"01747090362\",\"areaName\":\"Talaimari\"}', 'No Reason Said'),
(91, 14, 5, 1, '2023-10-30', '2023-11-06', 1, 0, 0, NULL, 'No Reason Said'),
(92, 14, 6, 1, '2023-10-30', '2023-11-06', 1, 0, 0, NULL, 'No Reason Said');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `order_details_id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_quantity` int NOT NULL DEFAULT '0',
  `product_total_price` double NOT NULL DEFAULT '0',
  `note_to_user` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stock_out` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`order_details_id`, `order_id`, `product_id`, `product_quantity`, `product_total_price`, `note_to_user`, `stock_out`) VALUES
(110, 90, 242, 1, 50, NULL, 0),
(111, 91, 240, 1, 70000, NULL, 0),
(112, 92, 243, 1, 150, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `order_history`
--

CREATE TABLE `order_history` (
  `order_history_id` int NOT NULL,
  `order_id` int NOT NULL,
  `status_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_history`
--

INSERT INTO `order_history` (`order_history_id`, `order_id`, `status_id`, `created_at`, `updated_at`) VALUES
(35, 90, 4, '2023-10-30 16:41:11', '2023-10-30 16:41:11'),
(36, 90, 5, '2023-10-30 16:41:38', '2023-10-30 16:41:38'),
(37, 91, 4, '2023-10-30 16:41:44', '2023-10-30 16:41:44'),
(38, 91, 5, '2023-10-30 16:41:48', '2023-10-30 16:41:48'),
(39, 92, 4, '2023-10-30 16:41:54', '2023-10-30 16:41:54'),
(40, 92, 5, '2023-10-30 16:41:59', '2023-10-30 16:41:59'),
(41, 92, 6, '2023-10-30 16:42:07', '2023-10-30 16:42:07');

-- --------------------------------------------------------

--
-- Table structure for table `payment_method`
--

CREATE TABLE `payment_method` (
  `payment_method_id` int NOT NULL,
  `method_name` varchar(250) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_method`
--

INSERT INTO `payment_method` (`payment_method_id`, `method_name`) VALUES
(1, 'Bkash'),
(2, 'Nagad');

-- --------------------------------------------------------

--
-- Table structure for table `payment_types`
--

CREATE TABLE `payment_types` (
  `id` int NOT NULL,
  `type_name` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_types`
--

INSERT INTO `payment_types` (`id`, `type_name`) VALUES
(1, 'shop_product'),
(2, 'reference'),
(3, 'withdraw'),
(4, 'sent money');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `product_price` double NOT NULL,
  `product_details_des` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `product_cat_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `seller_id` int DEFAULT NULL,
  `sell_count` int DEFAULT NULL,
  `quantity` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_price`, `product_details_des`, `product_cat_id`, `seller_id`, `sell_count`, `quantity`) VALUES
(240, 'iPhone 12', 70000, 'iPhone 12\r\niPhone 12 is a brand new smartphone from Apple where Apple introduces some extraordinary features. It holds a super powerful chip along with an advanced dual‑camera system. The phone covers with a Ceramic Shield front that\'s tougher than any smartphone glass. and a bright as well as a beautiful OLED display.\r\n\r\n \r\n\r\nWhy iPhone 12? (Key Features)\r\nFor its flawless design\r\nFor its fast and powerful chips\r\nFor its great battery life\r\nFor its outstanding camera\r\nFor MagSafe Compatibility\r\nFor Water and Dust resistance\r\nFor Ultimate Security options\r\n ', '460', 1, NULL, 1),
(242, 'Apple', 50, 'Fresh Apple', '461', 1, NULL, 5),
(243, 'Oranges', 150, 'Fresh oranges', '462', 1, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `product_image`
--

CREATE TABLE `product_image` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `featured_image` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_image`
--

INSERT INTO `product_image` (`id`, `product_id`, `product_image_url`, `featured_image`) VALUES
(289, 206, 'http://localhost:3000/uploads/product-featured-image-1697960840258-Untitled 3.png', 1),
(290, 206, 'http://localhost:3000/uploads/product-image-1697960840262-Untitled 3.png', 0),
(291, 207, 'http://localhost:3000/uploads/product-featured-image-1697991809361-Untitled 3.png', 1),
(292, 207, 'http://localhost:3000/uploads/product-image-1697991809364-Untitled 2.png', 0),
(293, 207, 'http://localhost:3000/uploads/product-image-1697991809367-Untitled.png', 0),
(294, 208, 'http://localhost:3000/uploads/product-featured-image-1697991930668-Untitled 2.png', 1),
(295, 208, 'http://localhost:3000/uploads/product-image-1697991930669-Untitled 3.png', 0),
(296, 209, 'http://localhost:3000/uploads/product-featured-image-1698301633007-Untitled 3.png', 1),
(297, 209, 'http://localhost:3000/uploads/product-image-1698301633012-Untitled 3.png', 0),
(298, 210, 'http://localhost:3000/uploads/product-featured-image-1698301728805-Untitled 3.png', 1),
(299, 210, 'http://localhost:3000/uploads/product-image-1698301728809-Untitled 3.png', 0),
(300, 211, 'http://localhost:3000/uploads/product-featured-image-1698303909134-Untitled 5.png', 1),
(301, 211, 'http://localhost:3000/uploads/product-image-1698303909138-Untitled 5.png', 0),
(302, 212, 'http://localhost:3000/uploads/product-featured-image-1698539282140-paypal.png', 1),
(303, 212, 'http://localhost:3000/uploads/product-image-1698539282141-Product-8.png', 0),
(304, 212, 'http://localhost:3000/uploads/product-image-1698539282142-product-upload-1.png', 0),
(305, 213, 'http://localhost:3000/uploads/product-featured-image-1698539802349-Product-2.png', 1),
(306, 213, 'http://localhost:3000/uploads/product-image-1698539802350-Product-6.png', 0),
(307, 213, 'http://localhost:3000/uploads/product-image-1698539802350-Product-8.png', 0),
(308, 213, 'http://localhost:3000/uploads/product-image-1698539802350-Product-7.png', 0),
(309, 214, 'http://localhost:3000/uploads/product-featured-image-1698540421015-Product-5.png', 1),
(310, 214, 'http://localhost:3000/uploads/product-image-1698540421015-Product-8.png', 0),
(311, 216, 'http://localhost:3000/uploads/product-featured-image-1698541004763-Product-4.png', 1),
(312, 217, 'http://localhost:3000/uploads/product-featured-image-1698541063457-master-card.png', 1),
(313, 218, 'http://localhost:3000/uploads/product-featured-image-1698541274114-Product-6.png', 1),
(314, 219, 'http://localhost:3000/uploads/product-featured-image-1698541544163-Product-3.png', 1),
(315, 219, 'http://localhost:3000/uploads/product-image-1698541544163-Product-8.png', 0),
(316, 222, 'http://localhost:3000/uploads/product-featured-image-1698581115658-Product-3.png', 1),
(317, 222, 'http://localhost:3000/uploads/product-image-1698581115659-Product-7.png', 0),
(318, 223, 'http://localhost:3000/uploads/product-featured-image-1698581323701-Product-3.png', 1),
(319, 223, 'http://localhost:3000/uploads/product-image-1698581323702-Product-4.png', 0),
(320, 224, 'http://localhost:3000/uploads/product-featured-image-1698581519608-Product-3.png', 1),
(321, 224, 'http://localhost:3000/uploads/product-image-1698581519609-Product-5.png', 0),
(322, 225, 'http://localhost:3000/uploads/product-featured-image-1698597206640-Product-4.png', 1),
(323, 225, 'http://localhost:3000/uploads/product-image-1698597206641-Product-3.png', 0),
(324, 225, 'http://localhost:3000/uploads/product-image-1698597206641-Product-1.png', 0),
(325, 226, 'http://localhost:3000/uploads/product-featured-image-1698597431488-Product-6.png', 1),
(326, 226, 'http://localhost:3000/uploads/product-image-1698597431489-Product-4.png', 0),
(327, 226, 'http://localhost:3000/uploads/product-image-1698597431490-Product-7.png', 0),
(328, 227, 'http://localhost:3000/uploads/product-featured-image-1698597761151-Product-4.png', 1),
(329, 227, 'http://localhost:3000/uploads/product-image-1698597761152-Product-4.png', 0),
(330, 227, 'http://localhost:3000/uploads/product-image-1698597761152-Product-3.png', 0),
(331, 228, 'http://localhost:3000/uploads/product-featured-image-1698655213302-iphone-12-black-1124.jpg', 1),
(332, 228, 'http://localhost:3000/uploads/product-image-1698655213303-1533-20141.jpg', 0),
(333, 228, 'http://localhost:3000/uploads/product-image-1698655213305-1533-33734.jpg', 0),
(334, 228, 'http://localhost:3000/uploads/product-image-1698655213305-1533-33833.jpg', 0),
(335, 228, 'http://localhost:3000/uploads/product-image-1698655213305-1533-91835.jpg', 0),
(336, 229, 'http://localhost:3000/uploads/product-featured-image-1698655668855-iphone-12-black-1124.jpg', 1),
(337, 229, 'http://localhost:3000/uploads/product-image-1698655668856-1533-20141.jpg', 0),
(338, 229, 'http://localhost:3000/uploads/product-image-1698655668857-1533-33734.jpg', 0),
(339, 229, 'http://localhost:3000/uploads/product-image-1698655668858-1533-33833.jpg', 0),
(340, 229, 'http://localhost:3000/uploads/product-image-1698655668859-1533-91835.jpg', 0),
(341, 230, 'http://localhost:3000/uploads/product-featured-image-1698658141937-pexels-anna-nekrashevich-7214602.jpg', 1),
(342, 230, 'http://localhost:3000/uploads/product-image-1698658141938-pexels-pixabay-326005.jpg', 0),
(343, 230, 'http://localhost:3000/uploads/product-image-1698658141939-pexels-pierpaolo-riondato-2966150.jpg', 0),
(344, 231, 'http://localhost:3000/uploads/product-featured-image-1698658280581-pexels-anna-nekrashevich-7214602.jpg', 1),
(345, 231, 'http://localhost:3000/uploads/product-image-1698658280582-pexels-pierpaolo-riondato-2966150.jpg', 0),
(346, 231, 'http://localhost:3000/uploads/product-image-1698658280584-pexels-pixabay-326005.jpg', 0),
(347, 232, 'http://localhost:3000/uploads/product-featured-image-1698658348405-pexels-anna-nekrashevich-7214602.jpg', 1),
(348, 232, 'http://localhost:3000/uploads/product-image-1698658348406-pexels-pierpaolo-riondato-2966150.jpg', 0),
(349, 232, 'http://localhost:3000/uploads/product-image-1698658348407-pexels-pixabay-326005.jpg', 0),
(350, 233, 'http://localhost:3000/uploads/product-featured-image-1698658562883-pexels-anna-nekrashevich-7214602.jpg', 1),
(351, 233, 'http://localhost:3000/uploads/product-image-1698658562883-pexels-pierpaolo-riondato-2966150.jpg', 0),
(352, 233, 'http://localhost:3000/uploads/product-image-1698658562884-pexels-pixabay-326005.jpg', 0),
(353, 234, 'http://localhost:3000/uploads/product-featured-image-1698658780570-pexels-adonyi-gaÌbor-1400172.jpg', 1),
(354, 234, 'http://localhost:3000/uploads/product-image-1698658780572-master-card.png', 0),
(355, 235, 'http://localhost:3000/uploads/product-featured-image-1698659052358-pexels-adonyi-gaÌbor-1400172.jpg', 1),
(356, 235, 'http://localhost:3000/uploads/product-image-1698659052359-pexels-adonyi-gaÌbor-1400172.jpg', 0),
(357, 236, 'http://localhost:3000/uploads/product-featured-image-1698659084368-pexels-adonyi-gaÌbor-1400172.jpg', 1),
(358, 236, 'http://localhost:3000/uploads/product-image-1698659084370-paypal.png', 0),
(359, 237, 'http://localhost:3000/uploads/product-featured-image-1698659349042-pexels-anna-nekrashevich-7214602.jpg', 1),
(360, 237, 'http://localhost:3000/uploads/product-image-1698659349044-pexels-pierpaolo-riondato-2966150.jpg', 0),
(361, 237, 'http://localhost:3000/uploads/product-image-1698659349045-pexels-pixabay-326005.jpg', 0),
(362, 238, 'http://localhost:3000/uploads/product-featured-image-1698659642438-pexels-anna-nekrashevich-7214602.jpg', 1),
(363, 238, 'http://localhost:3000/uploads/product-image-1698659642439-pexels-pierpaolo-riondato-2966150.jpg', 0),
(364, 238, 'http://localhost:3000/uploads/product-image-1698659642440-pexels-pixabay-326005.jpg', 0),
(365, 239, 'http://localhost:3000/uploads/product-featured-image-1698659850937-pexels-anna-nekrashevich-7214602.jpg', 1),
(366, 239, 'http://localhost:3000/uploads/product-image-1698659850937-pexels-pierpaolo-riondato-2966150.jpg', 0),
(367, 239, 'http://localhost:3000/uploads/product-image-1698659850938-pexels-pixabay-326005.jpg', 0),
(368, 240, 'http://localhost:3000/uploads/product-featured-image-1698660136153-iphone-12-black-1124.jpg', 1),
(369, 240, 'http://localhost:3000/uploads/product-image-1698660136154-1533-20141.jpg', 0),
(370, 240, 'http://localhost:3000/uploads/product-image-1698660136156-1533-33734.jpg', 0),
(371, 240, 'http://localhost:3000/uploads/product-image-1698660136156-1533-33833.jpg', 0),
(372, 240, 'http://localhost:3000/uploads/product-image-1698660136156-1533-91835.jpg', 0),
(373, 241, 'http://localhost:3000/uploads/product-featured-image-1698660398828-iphone-12-black-1124.jpg', 1),
(374, 241, 'http://localhost:3000/uploads/product-image-1698660398829-1533-20141.jpg', 0),
(375, 241, 'http://localhost:3000/uploads/product-image-1698660398831-1533-33734.jpg', 0),
(376, 241, 'http://localhost:3000/uploads/product-image-1698660398831-1533-33833.jpg', 0),
(377, 241, 'http://localhost:3000/uploads/product-image-1698660398832-1533-91835.jpg', 0),
(378, 242, 'http://localhost:3000/uploads/product-featured-image-1698660484078-pexels-anna-nekrashevich-7214602.jpg', 1),
(379, 242, 'http://localhost:3000/uploads/product-image-1698660484079-pexels-pierpaolo-riondato-2966150.jpg', 0),
(380, 242, 'http://localhost:3000/uploads/product-image-1698660484082-pexels-pixabay-326005.jpg', 0),
(381, 243, 'http://localhost:3000/uploads/product-featured-image-1698661490052-pexels-pixabay-161559.jpg', 1),
(382, 243, 'http://localhost:3000/uploads/product-image-1698661490053-pexels-taryn-elliott-4502957.jpg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_video`
--

CREATE TABLE `product_video` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_video_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `featured_video` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `status_id` int NOT NULL,
  `status_name` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`status_id`, `status_name`) VALUES
(1, 'Pending'),
(2, 'Confirm'),
(3, 'Processing'),
(4, 'Picked'),
(5, 'Shipped'),
(6, 'Delivered');

-- --------------------------------------------------------

--
-- Table structure for table `sub_cat`
--

CREATE TABLE `sub_cat` (
  `sub_cat_id` int NOT NULL,
  `sub_cat_ref` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `sub_cat_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `sub_cat_image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `popular_cat_value` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_cat`
--

INSERT INTO `sub_cat` (`sub_cat_id`, `sub_cat_ref`, `sub_cat_name`, `sub_cat_image_url`, `popular_cat_value`) VALUES
(99, '86', 'Mobiles', 'http://localhost:3000/uploads/sub-cat-image-1698654145683-pexels-mohi-syed-47261.jpg', NULL),
(100, '87', 'Fruits', 'http://localhost:3000/uploads/sub-cat-image-1698655364717-pexels-jane-doan-1171170.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int NOT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pic_url` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `user_email`, `user_password`, `date_of_birth`, `gender`, `pic_url`, `phone`) VALUES
(1, 'Mehedi Hasan', 'meek@test.com', '$2b$10$4j3QBtf3qa9pmZGu1BlA0OJP7TizbXeYGRPzGUCMQ7.wawTjUfL96', '2023-09-25', 'male', 'http://localhost:3000/images/userImg/Screenshot 2023-09-13 164622.png', '+8801747090362'),
(13, 'Khaleed Saifullah', 'abc@gmail.com', '$2b$10$hnKdrdscq3IED66UHbpHueN6ksUO8kkJw61Bm9c2WuJZqVg8MofIy', '0000-00-00', 'Male', 'https://mark-agro.soykothosen.com/images/userImg/profile-photo.JPG', '01323719171'),
(14, 'Somiha Tasnim', 's@gmail.com', '$2b$10$R572nLPAnnowlHv0Lcitgu1oOp/784jcAPFdIiC60jTswjHneinuG', '2000-10-09', 'female', 'http://localhost:3000/images/userImg/Logo.png', '01912941836'),
(15, 'Abu Jafor', 'a@email.com', '$2b$10$wfGQqHlZZcGmxV9wgQ3QJ.KHlwzTDjiyaKPOUhXVyBCqC.AMaEznq', NULL, NULL, NULL, '01846825017');

-- --------------------------------------------------------

--
-- Table structure for table `variant`
--

CREATE TABLE `variant` (
  `variant_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `variant`
--

INSERT INTO `variant` (`variant_id`, `product_id`, `variant_name`, `price`) VALUES
(45, 242, '2kg', 80),
(46, 242, '5kg', 180),
(47, 243, '2kg', 280);

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `wishlist_id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`wishlist_id`, `user_id`, `product_id`) VALUES
(7, 1, 1),
(10, 13, 1),
(11, 13, 2),
(13, 1, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `extra_cat`
--
ALTER TABLE `extra_cat`
  ADD PRIMARY KEY (`extra_cat_id`);

--
-- Indexes for table `flashsell`
--
ALTER TABLE `flashsell`
  ADD PRIMARY KEY (`flashSell_id`);

--
-- Indexes for table `main_cat`
--
ALTER TABLE `main_cat`
  ADD PRIMARY KEY (`main_cat_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`order_details_id`);

--
-- Indexes for table `order_history`
--
ALTER TABLE `order_history`
  ADD PRIMARY KEY (`order_history_id`);

--
-- Indexes for table `payment_method`
--
ALTER TABLE `payment_method`
  ADD PRIMARY KEY (`payment_method_id`);

--
-- Indexes for table `payment_types`
--
ALTER TABLE `payment_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `product_image`
--
ALTER TABLE `product_image`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_video`
--
ALTER TABLE `product_video`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `sub_cat`
--
ALTER TABLE `sub_cat`
  ADD PRIMARY KEY (`sub_cat_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `variant`
--
ALTER TABLE `variant`
  ADD PRIMARY KEY (`variant_id`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`wishlist_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `extra_cat`
--
ALTER TABLE `extra_cat`
  MODIFY `extra_cat_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=463;

--
-- AUTO_INCREMENT for table `flashsell`
--
ALTER TABLE `flashsell`
  MODIFY `flashSell_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `main_cat`
--
ALTER TABLE `main_cat`
  MODIFY `main_cat_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `order_details_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `order_history`
--
ALTER TABLE `order_history`
  MODIFY `order_history_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `payment_method`
--
ALTER TABLE `payment_method`
  MODIFY `payment_method_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payment_types`
--
ALTER TABLE `payment_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=244;

--
-- AUTO_INCREMENT for table `product_image`
--
ALTER TABLE `product_image`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=383;

--
-- AUTO_INCREMENT for table `product_video`
--
ALTER TABLE `product_video`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `status_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sub_cat`
--
ALTER TABLE `sub_cat`
  MODIFY `sub_cat_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `variant`
--
ALTER TABLE `variant`
  MODIFY `variant_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `wishlist_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
