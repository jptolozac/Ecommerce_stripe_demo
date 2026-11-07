jest.mock("../../../src/repository/cliente.repository")

const request = require("supertest")
const bcrypt = require("bcrypt")
const clientRepository = require("../../../src/repository/cliente.repository")
const clienteController = require("../../../src/controllers/cliente.controller")
const security = require("../../../src/middlewares/security")
const buildApp = require("../../helpers/buildApp")
const { bearer } = require("../../helpers/tokens")

// Mounted like routes.js does: behind the security middleware
const app = buildApp("/api/clientes", clienteController, security)
const auth = { Authorization: bearer() }

describe("/api/clientes", () => {
    test("rejects requests without a token", async () => {
        const res = await request(app).get("/api/clientes")
        expect(res.status).toBe(401)
        expect(clientRepository.getAll).not.toHaveBeenCalled()
    })

    test("GET / lists the clients", async () => {
        clientRepository.getAll.mockResolvedValue([{ id: 1 }, { id: 2 }])
        const res = await request(app).get("/api/clientes").set(auth)
        expect(res.status).toBe(200)
        expect(res.body.body).toEqual([{ id: 1 }, { id: 2 }])
    })

    test("GET /:id returns the client", async () => {
        clientRepository.get.mockResolvedValue([{ id: 3 }])
        const res = await request(app).get("/api/clientes/3").set(auth)
        expect(res.body.body).toEqual([{ id: 3 }])
        expect(clientRepository.get).toHaveBeenCalledWith("3")
    })

    test("GET / returns 500 when the repository fails", async () => {
        clientRepository.getAll.mockRejectedValue(new Error("db down"))
        const res = await request(app).get("/api/clientes").set(auth)
        expect(res.status).toBe(500)
    })

    test("PUT /:id hashes the new password before updating", async () => {
        clientRepository.update.mockResolvedValue({ affectedRows: 1 })
        const body = { nombre: "Ana", telefono: "1", direccion: "d", correo: "ana@test.com", password: "nueva" }

        const res = await request(app).put("/api/clientes/3").set(auth).send(body)

        expect(res.status).toBe(200)
        const [id, data] = clientRepository.update.mock.calls[0]
        expect(id).toBe("3")
        await expect(bcrypt.compare("nueva", data.password)).resolves.toBe(true)
    })

    test("PUT /:id returns 400 for an invalid email", async () => {
        const body = { nombre: "Ana", telefono: "1", direccion: "d", correo: "x", password: "p" }
        const res = await request(app).put("/api/clientes/3").set(auth).send(body)
        expect(res.status).toBe(400)
        expect(clientRepository.update).not.toHaveBeenCalled()
    })

    test("DELETE /:id removes the client", async () => {
        clientRepository.destroy.mockResolvedValue({ affectedRows: 1 })
        const res = await request(app).delete("/api/clientes/3").set(auth)
        expect(res.body.body).toBe("Se eliminó el cliente 3")
        expect(clientRepository.destroy).toHaveBeenCalledWith("3")
    })
})
