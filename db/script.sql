
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8;

USE `mydb`;

-- -----------------------------------------------------
-- Table `mydb`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`usuarios` (
  `id` INT NOT NULL,
  `nombre_completo` VARCHAR(100) NOT NULL,
  `dpi` VARCHAR(45) NOT NULL,
  `foto` TEXT NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`publicaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`publicaciones` (
  `id` INT NOT NULL,
  `descripcion` TEXT NOT NULL,
  `foto` TEXT NOT NULL,
  `usuarios_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_publicaciones_usuarios` FOREIGN KEY (`usuarios_id`) REFERENCES `mydb`.`usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`comentarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`comentarios` (
  `id` INT NOT NULL,
  `nombre_usuario` VARCHAR(45) NULL,
  `publicaciones_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_comentarios_publicaciones1` FOREIGN KEY (`publicaciones_id`) REFERENCES `mydb`.`publicaciones` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`amigos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`amigos` (
  `id` INT NOT NULL,
  `state` INT NOT NULL,
  `usuarios_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_amigos_usuarios1` FOREIGN KEY (`usuarios_id`) REFERENCES `mydb`.`usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`album`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`album` (
  `id` INT NOT NULL,
  `name_album` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`album_fotos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`album_fotos` (
  `id` INT NOT NULL,
  `album_id` INT NOT NULL,
  `publicaciones_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_album_fotos_album1` FOREIGN KEY (`album_id`) REFERENCES `mydb`.`album` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_album_fotos_publicaciones1` FOREIGN KEY (`publicaciones_id`) REFERENCES `mydb`.`publicaciones` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;
