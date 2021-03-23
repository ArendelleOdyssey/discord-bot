-- Dumped from PHPMyAdmin
--
-- Database: `ao_bot`
--
CREATE DATABASE IF NOT EXISTS `ao_bot` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ao_bot`;

-- --------------------------------------------------------

--
-- Table structure for table `api-token`
--

DROP TABLE IF EXISTS `api-token`;
CREATE TABLE IF NOT EXISTS `api-token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(128) NOT NULL,
  `token` varchar(512) DEFAULT NULL,
  `description` text NOT NULL,
  `validate` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `date_start` date NOT NULL,
  `date_end` date DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `giveaways`
--

DROP TABLE IF EXISTS `giveaways`;
CREATE TABLE IF NOT EXISTS `giveaways` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `message_id` varchar(64) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `jinxs`
--

DROP TABLE IF EXISTS `jinxs`;
CREATE TABLE IF NOT EXISTS `jinxs` (
  `count` int(1) NOT NULL,
  `last` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `mention_responses`
--

DROP TABLE IF EXISTS `mention_responses`;
CREATE TABLE IF NOT EXISTS `mention_responses` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `user` varchar(64) NOT NULL,
  `command-name` varchar(32) NOT NULL,
  `message` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `twitter_status`
--

DROP TABLE IF EXISTS `twitter_status`;
CREATE TABLE IF NOT EXISTS `twitter_status` (
  `isOnline` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`isOnline`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
COMMIT;