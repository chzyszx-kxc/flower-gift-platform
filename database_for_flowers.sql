-- MySQL dump 10.13  Distrib 9.6.0, for macos15 (arm64)
--
-- Host: localhost    Database: database_for_flowers
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_flower`
--

DROP TABLE IF EXISTS `tb_flower`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_flower` (
  `id` int NOT NULL AUTO_INCREMENT,
  `season_id` int NOT NULL,
  `flower_folder` varchar(50) NOT NULL,
  `flower_name` varchar(100) NOT NULL,
  `product_role` enum('primary','secondary') NOT NULL,
  `position_no` tinyint NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `summary` varchar(255) DEFAULT NULL,
  `description` text,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_flower_season_position` (`season_id`,`position_no`),
  UNIQUE KEY `uk_flower_season_folder` (`season_id`,`flower_folder`),
  CONSTRAINT `fk_flower_season` FOREIGN KEY (`season_id`) REFERENCES `tb_flower_season` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_flower`
--

LOCK TABLES `tb_flower` WRITE;
/*!40000 ALTER TABLE `tb_flower` DISABLE KEYS */;
INSERT INTO `tb_flower` VALUES (1,1,'flowerprimary','第一季主推花','primary',1,199.00,'第一季限定主推花束','第一季主推花，适合作为季节主题商品展示。',1),(2,1,'flowersecond1','第一季伴生花一','secondary',2,89.00,'第一季伴生产品一','第一季伴生花一，可作为主推花的搭配产品。',1),(3,1,'flowersecond2','第一季伴生花二','secondary',3,99.00,'第一季伴生产品二','第一季伴生花二，用于丰富第一季商品选择。',1),(4,2,'flowerprimary','第二季主推花','primary',1,219.00,'第二季限定主推花束','第二季主推花，适合作为季节主题商品展示。',1),(5,2,'flowersecond1','第二季伴生花一','secondary',2,96.00,'第二季伴生产品一','第二季伴生花一，可作为主推花的搭配产品。',1),(6,2,'flowersecond2','第二季伴生花二','secondary',3,108.00,'第二季伴生产品二','第二季伴生花二，用于丰富第二季商品选择。',1),(7,3,'flowerprimary','第三季主推花','primary',1,239.00,'第三季限定主推花束','第三季主推花，适合作为季节主题商品展示。',1),(8,3,'flowersecond1','第三季伴生花一','secondary',2,109.00,'第三季伴生产品一','第三季伴生花一，可作为主推花的搭配产品。',1),(9,3,'flowersecond2','第三季伴生花二','secondary',3,119.00,'第三季伴生产品二','第三季伴生花二，用于丰富第三季商品选择。',1),(10,4,'flowerprimary','第四季主推花','primary',1,259.00,'当季限定主推花束','第四季主推花，当前季节主推商品，详情页可使用主推布局。',1),(11,4,'flowersecond1','第四季伴生花一','secondary',2,129.00,'当季伴生产品一','第四季伴生花一，可作为当季主推花的搭配产品。',1),(12,4,'flowersecond2','第四季伴生花二','secondary',3,139.00,'当季伴生产品二','第四季伴生花二，用于丰富当季商品选择。',1);
/*!40000 ALTER TABLE `tb_flower` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_flower_description`
--

DROP TABLE IF EXISTS `tb_flower_description`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_flower_description` (
  `flower_id` int NOT NULL,
  `category` varchar(255) NOT NULL,
  `product_detail_description` text NOT NULL,
  PRIMARY KEY (`flower_id`),
  CONSTRAINT `fk_tb_flower_description_flower` FOREIGN KEY (`flower_id`) REFERENCES `tb_flower` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_flower_description`
--

LOCK TABLES `tb_flower_description` WRITE;
/*!40000 ALTER TABLE `tb_flower_description` DISABLE KEYS */;
INSERT INTO `tb_flower_description` VALUES (1,'厄瓜多尔高山红玫瑰、复古牛皮纸','一束带有电影感的深红花礼，以丝绒质地的高山玫瑰为主体，配以手揉牛皮纸与酒红缎带。灵感穿行于后座皮革、掠过车窗的暮色，以及一场正在路上的温柔告白。只甄选清晨采切的饱满红玫瑰，经低温冷链醒花、手工修枝与层叠式包扎，让每一朵花在抵达时仍保有近乎新鲜心跳的张力。'),(2,'云南高原红玫瑰、复色石竹、银镜爱心气球与透明亚克力花盒','只甄选花型饱满的红玫瑰，经醒花、修枝、定点插制与层次塑形，让每一朵花都保持向外盛放的姿态。一件介于花礼与装置之间的作品。以热烈红玫瑰作为视觉中心，穿插精巧小花与自然枝条，再由银色心形气球、红缎带和透明花盒共同托起整个画面，像一场被提前布置好的惊喜，在街角、车边或生日现场静静等待主角出现。'),(3,'云南高原红玫瑰、银镜爱心气球、镀银镜面花盒','一件更直接、更闪耀的告白花礼。以高饱和红玫瑰作为情绪核心，搭配银色镜面爱心气球与同色系金属感花盒，让“Love”不只停留在文字上，而是在气球、花瓣、光影和路面之间反复折射。黑色缎带压住整体甜度，使这份浪漫带着一点冷感、坚定和高级的仪式感。只甄选花型紧实、色泽浓烈的红玫瑰，经醒花、修枝、定点插制与镜面包装塑形，让每一朵玫瑰都像被郑重安放的心意。'),(4,'暗夜黑松、厄瓜多尔手染玫瑰、迷你南瓜、女巫玩偶、拉丝银色花器','只甄选花型紧实、色彩戏剧感强的玫瑰，经醒花、染色、定点插制与节日装饰塑形，让每一杯花礼都拥有独立的角色感。银色花器收住暗黑气质，黑松枝撑起神秘轮廓，小南瓜与女巫帽则把节日的顽皮轻轻点亮。它不是传统意义上的花束，而是一件可以摆在桌边、橱窗、派对入口或礼物角落的万圣节情绪装置'),(5,'暗夜黑松、厄瓜多尔手染玫瑰、迷你南瓜、女巫玩偶、拉丝银色花器','只甄选花型紧实、色彩戏剧感强的玫瑰，经醒花、染色、定点插制与节日装饰塑形，让每一杯花礼都拥有独立的角色感。银色花器收住暗黑气质，黑松枝撑起神秘轮廓，小南瓜与女巫帽则把节日的顽皮轻轻点亮。它不是传统意义上的花束，而是一件可以摆在桌边、橱窗、派对入口或礼物角落的万圣节情绪装置'),(6,'暗夜黑松、厄瓜多尔手染玫瑰、迷你南瓜、女巫玩偶、拉丝银色花器','只甄选花型紧实、色彩戏剧感强的玫瑰，经醒花、染色、定点插制与节日装饰塑形，让每一杯花礼都拥有独立的角色感。银色花器收住暗黑气质，黑松枝撑起神秘轮廓，小南瓜与女巫帽则把节日的顽皮轻轻点亮。它不是传统意义上的花束，而是一件可以摆在桌边、橱窗、派对入口或礼物角落的万圣节情绪装置'),(7,'云南高原黄玫瑰、奶油白蝴蝶兰、青柠绿桔梗、浅黄雏菊、一支被施了快乐魔法的香蕉','只甄选色泽清亮、层次蓬松的花材，经醒花、修枝、定点插制与篮式环绕塑形，让整件作品像一只装满阳光的野餐篮。为了禁止蕉绿 而设计了一篮专门用来驱散焦虑的明亮花礼。以黄、白、嫩绿作为主色，将玫瑰的温柔、兰花的轻盈、雏菊的晴朗与香蕉的俏皮感交织在一起。'),(8,'荷兰温室白玫瑰、冰雾蓝手染玫瑰、白藤编花篮','只甄选花型圆润、层次紧密的玫瑰，经醒花、修枝、手工染色与篮式铺陈塑形，让整件作品呈现出蓬松而克制的呼吸感。白藤篮削弱了玫瑰的浓烈，使它更像一份安静抵达的陪伴：不张扬，却足够难忘；不炽热，却有一种长久停留的清澈。一篮像清晨雾气般安静的蓝白玫瑰花礼。以奶油白玫瑰作为柔和底色，再让冰蓝色从花瓣边缘慢慢晕开，像云层、海盐、月光与一场未说出口的温柔心事，被整齐安放在白色藤篮里。'),(9,'厄瓜多尔丝绒红玫瑰、雪白蝴蝶兰、手编白藤花篮','只甄选花型饱满、花瓣层次紧密的红玫瑰，经低温醒花、修枝、分层定点插制与满篮式铺排，让每一朵玫瑰都保持向上盛放的姿态。象牙缎带、金色爱心吊牌与白色蝴蝶兰共同完成最后的温柔收束。一篮近乎“满溢”的红玫瑰花礼。以浓郁红玫瑰铺陈出整片花面，像一座被爱意填满的小型花园；白色藤篮与蝴蝶兰环绕了红玫瑰的炽烈，让它在热烈之外多了一层干净、柔软的仪式感。'),(10,'哥伦比亚安第斯长茎红玫瑰、透明塔式花筒、森林苔藓基底','只甄选枝干挺拔、花头饱满的一米级长茎玫瑰，经低温醒花、叶片修整、花姿校准与透明筒封装，让整件作品呈现出标本般的纯净与雕塑感。苔藓基底保留自然的潮湿气息，透明花筒则把一朵玫瑰变成一座小型纪念碑。一支近乎仪式化的单枝玫瑰作品。不同于成束花礼的丰盛表达，它只保留一朵红玫瑰、一根完整长茎与一只透明花筒，让爱意被拉长、被凝视，也被郑重地安放在近乎纯白的空间里。'),(11,'哥伦比亚冷雾紫玫瑰、月光蓝手染花瓣、常青叶环抱、白藤编花篮','一篮像童话梦境般柔软的紫蓝玫瑰花礼。以雾紫与冰蓝交叠的玫瑰作为视觉中心。只甄选花型圆润、层次紧密的玫瑰，经低温醒花、手工晕染、定点插制与篮式环绕塑形，让每一朵花都呈现出介于清晨薄雾与月光海岸之间的梦幻色泽。'),(12,'保加利亚晨雾白玫瑰、雪白蝴蝶兰、法式白色礼帽盒','一件克制而郑重的纯白花礼。以白玫瑰构成柔软而饱满的主体，再让蝴蝶兰像月光一样停落在花面之上，削弱传统玫瑰的浓烈表达，转而呈现一种更安静、更高级的爱意。黑色西装与白色花盒的视觉对比，使它像一场正式赴约前被递出的承诺：没有过多修饰，却足够清晰、坚定、难忘。每一朵白玫瑰都经过低温醒花、花型筛选与圆弧式聚合插制，让花面保持近乎云团般的丰盈质感。蝴蝶兰被安置在视觉中心，如同一句轻声落下的誓言；象牙缎带则把整件作品收束得干净而温柔。它不只是白色花束，更像一封被静默保存的信');
/*!40000 ALTER TABLE `tb_flower_description` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_flower_image`
--

DROP TABLE IF EXISTS `tb_flower_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_flower_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `flower_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `sort_order` tinyint NOT NULL DEFAULT '1',
  `is_cover` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_flower_image_url` (`flower_id`,`image_url`),
  KEY `idx_flower_image_sort` (`flower_id`,`sort_order`),
  CONSTRAINT `fk_flower_image_flower` FOREIGN KEY (`flower_id`) REFERENCES `tb_flower` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_flower_image`
--

LOCK TABLES `tb_flower_image` WRITE;
/*!40000 ALTER TABLE `tb_flower_image` DISABLE KEYS */;
INSERT INTO `tb_flower_image` VALUES (1,1,'/img/flowers/season1/flowerprimary/primary.jpg',1,1),(2,2,'/img/flowers/season1/flowersecond1/primary.jpg',1,1),(3,2,'/img/flowers/season1/flowersecond1/IMG_1139.jpg',2,0),(4,2,'/img/flowers/season1/flowersecond1/IMG_1140.jpg',3,0),(5,3,'/img/flowers/season1/flowersecond2/primary.jpg',1,1),(6,4,'/img/flowers/season2/flowerprimary/primary.jpg',1,1),(7,4,'/img/flowers/season2/flowerprimary/IMG_1150.jpg',2,0),(8,5,'/img/flowers/season2/flowersecond1/primary.jpg',1,1),(9,6,'/img/flowers/season2/flowersecond2/primary.jpg',1,1),(10,7,'/img/flowers/season3/flowerprimary/primary.JPG',1,1),(11,8,'/img/flowers/season3/flowersecond1/primary.jpg',1,1),(12,8,'/img/flowers/season3/flowersecond1/IMG_1133.jpg',2,0),(13,8,'/img/flowers/season3/flowersecond1/IMG_1134.jpg',3,0),(14,9,'/img/flowers/season3/flowersecond2/primary.jpg',1,1),(15,10,'/img/flowers/season4/flowerprimary/primary.jpg',1,1),(16,10,'/img/flowers/season4/flowerprimary/IMG_1103.jpg',2,0),(17,10,'/img/flowers/season4/flowerprimary/pricture1.jpg',3,0),(18,11,'/img/flowers/season4/flowersecond1/primary.jpg',1,1),(19,12,'/img/flowers/season4/flowersecond2/primary.jpg',1,1);
/*!40000 ALTER TABLE `tb_flower_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_flower_season`
--

DROP TABLE IF EXISTS `tb_flower_season`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_flower_season` (
  `id` int NOT NULL AUTO_INCREMENT,
  `season_code` varchar(20) NOT NULL,
  `season_name` varchar(30) NOT NULL,
  `theme_name` varchar(50) DEFAULT NULL,
  `theme_description` text,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `subscribe_start_date` date DEFAULT NULL,
  `subscribe_end_date` date DEFAULT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `season_code` (`season_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_flower_season`
--

LOCK TABLES `tb_flower_season` WRITE;
/*!40000 ALTER TABLE `tb_flower_season` DISABLE KEYS */;
INSERT INTO `tb_flower_season` VALUES (1,'season1','第一季花礼','玫瑰邮差','炽热的风把花香写成来信，送往每一个明亮的午后。愿这份盛放陪你穿过热烈时光，留下清澈又鲜活的记忆。','2025-10-08','2026-01-07','2025-10-08','2025-10-18',0),(2,'season2','第二季花礼','暮色回响','暮色落在花瓣边缘，像一段被珍藏的回响。愿你在渐凉的季节里仍有温暖可依，也有美好值得慢慢收藏。','2026-01-08','2026-04-07','2026-01-08','2026-01-18',0),(3,'season3','第三季花礼','禁止蕉绿','千万不要蕉绿啊！','2026-04-08','2026-07-07','2026-04-08','2026-04-18',0),(4,'season4','第四季花礼','枪炮玫瑰','玫瑰在晨光里悄然盛放，像一份温柔的祝福来到你身旁。愿你往后的日子，有花开的浪漫，也有一路相随的幸运与美好。','2026-07-08','2026-10-07','2026-07-08','2026-07-18',1);
/*!40000 ALTER TABLE `tb_flower_season` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_subscription`
--

DROP TABLE IF EXISTS `tb_subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_subscription` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plan_type` enum('current_season','four_season') NOT NULL,
  `start_season_id` int NOT NULL,
  `total_season_count` int NOT NULL,
  `allocated_season_count` int NOT NULL DEFAULT '1',
  `subscription_status` enum('active','finished','cancelled') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_subscription_user_start_season` (`user_id`,`start_season_id`),
  KEY `idx_subscription_user_status` (`user_id`,`subscription_status`),
  KEY `idx_subscription_start_season` (`start_season_id`),
  CONSTRAINT `fk_subscription_start_season` FOREIGN KEY (`start_season_id`) REFERENCES `tb_flower_season` (`id`),
  CONSTRAINT `fk_subscription_user` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_subscription`
--

LOCK TABLES `tb_subscription` WRITE;
/*!40000 ALTER TABLE `tb_subscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_subscription_delivery`
--

DROP TABLE IF EXISTS `tb_subscription_delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_subscription_delivery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subscription_id` int NOT NULL,
  `user_id` int NOT NULL,
  `season_id` int NOT NULL,
  `selected_flower_id` int DEFAULT NULL,
  `delivery_status` enum('pending_select','shipping','completed') NOT NULL DEFAULT 'pending_select',
  `receiver_name_snapshot` varchar(50) DEFAULT NULL,
  `receiver_phone_snapshot` varchar(20) DEFAULT NULL,
  `address_snapshot` varchar(255) DEFAULT NULL,
  `reserved_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_subscription_delivery_user_season` (`user_id`,`season_id`),
  UNIQUE KEY `uk_subscription_delivery_subscription_season` (`subscription_id`,`season_id`),
  KEY `idx_subscription_delivery_user_status` (`user_id`,`delivery_status`),
  KEY `idx_subscription_delivery_season` (`season_id`),
  KEY `idx_subscription_delivery_flower` (`selected_flower_id`),
  CONSTRAINT `fk_subscription_delivery_flower` FOREIGN KEY (`selected_flower_id`) REFERENCES `tb_flower` (`id`),
  CONSTRAINT `fk_subscription_delivery_season` FOREIGN KEY (`season_id`) REFERENCES `tb_flower_season` (`id`),
  CONSTRAINT `fk_subscription_delivery_subscription` FOREIGN KEY (`subscription_id`) REFERENCES `tb_subscription` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_subscription_delivery_user` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_subscription_delivery`
--

LOCK TABLES `tb_subscription_delivery` WRITE;
/*!40000 ALTER TABLE `tb_subscription_delivery` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_subscription_delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_user`
--

DROP TABLE IF EXISTS `tb_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_user`
--

LOCK TABLES `tb_user` WRITE;
/*!40000 ALTER TABLE `tb_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_user_delivery_info`
--

DROP TABLE IF EXISTS `tb_user_delivery_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_user_delivery_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `receiver_name` varchar(50) NOT NULL,
  `receiver_phone` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_delivery_info_user` (`user_id`),
  CONSTRAINT `fk_user_delivery_info_user` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_user_delivery_info`
--

LOCK TABLES `tb_user_delivery_info` WRITE;
/*!40000 ALTER TABLE `tb_user_delivery_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_user_delivery_info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-13 12:09:13
