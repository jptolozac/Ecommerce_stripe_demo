const { body } = require("express-validator");

const clienteValidator = [
  body("nombre").exists().isString().notEmpty(),
  body("telefono").exists().isString().notEmpty(),
  body("direccion").exists().isString().notEmpty(),
  body("correo").isEmail().withMessage("Correo inválido"),
  body("password").exists().isString().notEmpty(),
];

module.exports = { clienteValidator };
