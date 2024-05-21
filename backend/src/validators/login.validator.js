const { body } = require("express-validator");

const loginValidator = [
  body("correo").isEmail().withMessage("Correo inválido"),
  body("password").exists().isString().notEmpty(),
];

module.exports = { loginValidator };
