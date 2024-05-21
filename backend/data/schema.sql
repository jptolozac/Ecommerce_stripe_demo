
-- -----------------------------------------------------
-- Schema tienda_libros
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `tienda_libros` DEFAULT CHARACTER SET utf8 ;
USE `tienda_libros` ;

-- -----------------------------------------------------
-- Table `tienda_libros`.`cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tienda_libros`.`cliente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(60) NOT NULL,
  `telefono` VARCHAR(15) NOT NULL,
  `direccion` VARCHAR(60) NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE (`correo`));

-- -----------------------------------------------------
-- Table `tienda_libros`.`estado_factura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tienda_libros`.`estado_factura` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `tienda_libros`.`factura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tienda_libros`.`factura` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `total` DOUBLE,
  `cliente_id` INT NOT NULL,
  `estado_factura_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_factura_cliente`
    FOREIGN KEY (`cliente_id`)
    REFERENCES `tienda_libros`.`cliente` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_factura_estado_factura1`
    FOREIGN KEY (`estado_factura_id`)
    REFERENCES `tienda_libros`.`estado_factura` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);

-- -----------------------------------------------------
-- Table `tienda_libros`.`autor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tienda_libros`.`autor` (
  `id` INT NOT NULL,
  `nombre` VARCHAR(60) NOT NULL,
  `pais_origen` VARCHAR(100) NOT NULL,
  `biografia` TEXT(500) NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `tienda_libros`.`libro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tienda_libros`.`libro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NOT NULL,
  `publicacion_year` varchar(11) NOT NULL,
  `disponibilidad` INT NOT NULL,
  `sinopsis` TEXT(1000) NOT NULL,
  `precio` VARCHAR(45) NOT NULL,
  `autor_id` INT NOT NULL,
  `imagen_url` varchar(100) NOT NULL, 
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_libro_autor1`
    FOREIGN KEY (`autor_id`)
    REFERENCES `tienda_libros`.`autor` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `tienda_libros`.`factura_libro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tienda_libros`.`factura_libro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `libro_id` INT NOT NULL,
  `factura_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_factura_libro_libro1`
    FOREIGN KEY (`libro_id`)
    REFERENCES `tienda_libros`.`libro` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_factura_libro_factura1`
    FOREIGN KEY (`factura_id`)
    REFERENCES `tienda_libros`.`factura` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `tienda_libros`.`categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tienda_libros`.`categoria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `tienda_libros`.`categoria_libro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tienda_libros`.`categoria_libro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `libro_id` INT NOT NULL,
  `categoria_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_categoria_libro_libro1`
    FOREIGN KEY (`libro_id`)
    REFERENCES `tienda_libros`.`libro` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_categoria_libro_categoria1`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `tienda_libros`.`categoria` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);