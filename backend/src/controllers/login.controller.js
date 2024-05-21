const express = require("express");
const router = express.Router();

const { LoginDTO } = require("../dto/login.dto");
const { ClienteDTO } = require("../dto/cliente.dto");
const response = require("../responses/response");
const clientRepository = require("../repository/cliente.repository");

const { loginValidator } = require("../validators/login.validator");
const { clienteValidator } = require("../validators/cliente.validator");
const { validarErrores } = require("../middlewares/DataValidation");
const bcrypt = require("bcrypt");
const auth = require("../auth/index");

router.post("/login", loginValidator, validarErrores, login);
router.post("/signup", clienteValidator, validarErrores, signup);


async function login(req, res) {
  console.log(req.body);
  let cliente = await clientRepository.getByEmail(new LoginDTO(req.body));
  cliente = cliente.length > 0 ? cliente[0] : null

  if (cliente && (await bcrypt.compare(req.body.password, cliente.password))) {
    const clienteData = {
        id: cliente.id,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        correo: cliente.correo
    }
    const responseData = {
        token: auth.asignToken(clienteData)
    }
    response.success(req, res, responseData)
  } else {
    return response.error(req, res, "datos incorrectos", 401);
  }
}

async function signup(req, res) {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 5);
      await clientRepository.add(new ClienteDTO(req.body));
      response.success(req, res, "Se añadió el cliente correctamente");
    } catch (error) {
      console.log(error.stack);
      response.error(req, res, "Error al añadir el cliente");
    }
  }

module.exports = router;
