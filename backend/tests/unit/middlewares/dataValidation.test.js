const { validarErrores } = require("../../../src/middlewares/DataValidation")
const { loginValidator } = require("../../../src/validators/login.validator")
const { clienteValidator } = require("../../../src/validators/cliente.validator")
const { mockRes } = require("../../helpers/fixtures")

async function validate(validators, body) {
    const req = { body }
    for (const validator of validators) await validator.run(req)
    const res = mockRes()
    const next = jest.fn()
    validarErrores(req, res, next)
    return { res, next, firstError: res.send.mock.calls[0]?.[0].body }
}

const validCliente = {
    nombre: "Ana",
    telefono: "3000000000",
    direccion: "Calle 1",
    correo: "ana@test.com",
    password: "secreto",
}

describe("loginValidator + validarErrores", () => {
    test("passes a valid body to next", async () => {
        const { next, res } = await validate(loginValidator, { correo: "ana@test.com", password: "x" })
        expect(next).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
    })

    test("rejects an invalid email with 400 and the custom message", async () => {
        const { next, res, firstError } = await validate(loginValidator, { correo: "no-email", password: "x" })
        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(firstError).toMatchObject({ path: "correo", msg: "Correo inválido" })
    })

    test("rejects an empty password", async () => {
        const { firstError } = await validate(loginValidator, { correo: "ana@test.com", password: "" })
        expect(firstError).toMatchObject({ path: "password" })
    })
})

describe("clienteValidator + validarErrores", () => {
    test("passes a complete client", async () => {
        const { next } = await validate(clienteValidator, validCliente)
        expect(next).toHaveBeenCalled()
    })

    test.each(["nombre", "telefono", "direccion", "password"])("rejects a missing %s", async (field) => {
        const body = { ...validCliente }
        delete body[field]
        const { next, firstError } = await validate(clienteValidator, body)
        expect(next).not.toHaveBeenCalled()
        expect(firstError).toMatchObject({ path: field })
    })

    test("rejects a non-string phone", async () => {
        const { firstError } = await validate(clienteValidator, { ...validCliente, telefono: 300 })
        expect(firstError).toMatchObject({ path: "telefono" })
    })
})
