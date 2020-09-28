CREATE TABLE `challenge`.`favorite_product` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_id` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `id_customer_id_UNIQUE` (`id` ASC, `customer_id` ASC) VISIBLE,
  INDEX `fk_favorite_product_customer_idx` (`customer_id` ASC) VISIBLE,
  CONSTRAINT `fk_favorite_product_customer`
    FOREIGN KEY (`customer_id`)
    REFERENCES `challenge`.`customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);