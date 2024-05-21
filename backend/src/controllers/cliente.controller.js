const express = require("express");
const router = express.Router();

const clientRepository = require("../repository/cliente.repository");
const response = require("../responses/response");
const { ClienteDTO } = require("../dto/cliente.dto");

const { clienteValidator } = require("../validators/cliente.validator");
const { validarErrores } = require("../middlewares/DataValidation")
const bcrypt = require("bcrypt");

router.get("/", getAll);
router.get("/:id", get);
router.put("/:id", clienteValidator, validarErrores, update);
router.delete("/:id", destroy);

async function getAll(req, res) {
  try {
    const allClients = await clientRepository.getAll();
    response.success(req, res, allClients);
  } catch (error) {
    response.error(req, res, error);
  }
}

async function get(req, res) {
  try {
    const client = await clientRepository.get(req.params.id);
    response.success(req, res, client);
  } catch (error) {
    console.log(error.stack);
    response.error(req, res, error);
  }
}

async function update(req, res) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 5)
    await clientRepository.update(req.params.id, new ClienteDTO(req.body));
    response.success(
      req,
      res,
      `Se actualizó el cliente ${req.params.id} correctamente`
    );
  } catch (error) {
    console.log(error.stack);
    response.error(req, res, "Error al actualizar el cliente");
  }
}

async function destroy(req, res) {
  try {
    await clientRepository.destroy(req.params.id);
    response.success(req, res, `Se eliminó el cliente ${req.params.id}`);
  } catch (error) {
    console.log(error.stack);
    response.error(req, res, error);
  }
}

module.exports = router;
