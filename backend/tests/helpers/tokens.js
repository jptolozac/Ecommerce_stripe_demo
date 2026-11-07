const jwt = require("jsonwebtoken")

const testClient = { id: 7, nombre: "Ana", telefono: "3000000000", direccion: "Calle 1", correo: "ana@test.com" }

function bearer(payload = testClient) {
    return `Bearer ${jwt.sign(payload, process.env.JWT_SECRET)}`
}

module.exports = { testClient, bearer }
