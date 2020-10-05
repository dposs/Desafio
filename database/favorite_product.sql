CREATE TABLE `favorite_product` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int(10) unsigned NOT NULL,
  `product_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `customer_id_product_id_UNIQUE` (`customer_id`, `product_id`),
  KEY `fk_favorite_product_customer_INDEX` (`customer_id`),
  CONSTRAINT `fk_favorite_product_customer` 
    FOREIGN KEY (`customer_id`) 
    REFERENCES `customer` (`id`)
