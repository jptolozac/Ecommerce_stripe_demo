const { validationResult } = require("express-validator");
const response = require("../responses/response")

function validarErrores(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.error(req, res, errors.array()[0], 400);
  }
  next();
}

module.exports = { validarErrores }