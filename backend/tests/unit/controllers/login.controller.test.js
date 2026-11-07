jest.mock("../../../src/repository/cliente.repository")

const request = require("supertest")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const clientRepository = require("../../../src/repository/cliente.repository")
const loginController = require("../../../src/controllers/login.controller")
const buildApp = require("../../helpers/buildApp")

const app = buildApp("/api", loginController)

describe("POST /api/login", () => {
    let storedClient

    beforeAll(async () => {
        storedClient = {
            id: 7,
            nombre: "Ana",
            telefono: "3000000000",
            direccion: "Calle 1",
            correo: "ana@test.com",
            password: await bcrypt.hash("secreto", 4),
        }
    })

    test("returns a JWT with the client data (without password) for valid credentials", async () => {
        clientRepository.getByEmail.mockResolvedValue([storedClient])

        const res = await request(app).post("/api/login").send({ correo: "ana@test.com", password: "secreto" })

        expect(res.status).toBe(200)
        const decoded = jwt.verify(res.body.body.token, process.env.JWT_SECRET)
        expect(decoded).toEqual({ id: 7, nombre: "Ana", telefono: "3000000000", direccion: "Calle 1", correo: "ana@test.com" })
        expect(clientRepository.getByEmail).toHaveBeenCalledWith({ correo: "ana@test.com", password: "secreto" })
    })

    test("returns 401 when the password is wrong", async () => {
        clientRepository.getByEmail.mockResolvedValue([storedClient])

        const res = await request(app).post("/api/login").send({ correo: "ana@test.com", password: "otra" })

        expect(res.status).toBe(401)
        expect(res.body).toEqual({ error: true, status: 401, body: "datos incorrectos" })
    })

    test("returns 401 when the email does not exist", async () => {
        clientRepository.getByEmail.mockResolvedValue([])

        const res = await request(app).post("/api/login").send({ correo: "nadie@test.com", password: "secreto" })

        expect(res.status).toBe(401)
    })

    test("returns 400 and skips the repository when the body is invalid", async () => {
        const res = await request(app).post("/api/login").send({ correo: "no-email" })

        expect(res.status).toBe(400)
        expect(clientRepository.getByEmail).not.toHaveBeenCalled()
    })
})

describe("POST /api/signup", () => {
    const newClient = { nombre: "Luis", telefono: "3111111111", direccion: "Calle 2", correo: "luis@test.com", password: "clave" }

    test("stores the client with a hashed password", async () => {
        clientRepository.add.mockResolvedValue({ insertId: 11 })

        const res = await request(app).post("/api/signup").send({ ...newClient, rol: "admin" })

        expect(res.status).toBe(200)
        expect(res.body.body).toBe("Se añadió el cliente correctamente")
        const saved = clientRepository.add.mock.calls[0][0]
        expect(saved).not.toHaveProperty("rol")
        expect(saved.password).not.toBe("clave")
        await expect(bcrypt.compare("clave", saved.password)).resolves.toBe(true)
    })

    test("returns 500 when the repository fails (e.g. duplicated email)", async () => {
        clientRepository.add.mockRejectedValue(new Error("ER_DUP_ENTRY"))

        const res = await request(app).post("/api/signup").send(newClient)

        expect(res.status).toBe(500)
        expect(res.body.body).toBe("Error al añadir el cliente")
    })

    test("returns 400 when a field is missing", async () => {
        const res = await request(app).post("/api/signup").send({ ...newClient, nombre: "" })

        expect(res.status).toBe(400)
        expect(clientRepository.add).not.toHaveBeenCalled()
    })
})
