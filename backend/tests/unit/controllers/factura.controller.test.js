jest.mock("../../../src/repository/factura.repository")
jest.mock("../../../src/helpers/formatBookResponse.helper")

const request = require("supertest")
const facturaRepository = require("../../../src/repository/factura.repository")
const formatBookResponse = require("../../../src/helpers/formatBookResponse.helper")
const facturaController = require("../../../src/controllers/factura.controller")
const security = require("../../../src/middlewares/security")
const buildApp = require("../../helpers/buildApp")
const { bearer, testClient } = require("../../helpers/tokens")
const { bookRow } = require("../../helpers/fixtures")

const app = buildApp("/api/facturas", facturaController, security)
const auth = { Authorization: bearer() }

beforeEach(() => {
    formatBookResponse.mockImplementation(async (req, res, book) => ({ id: book.id, cantidad: book.cantidad }))
})

describe("/api/facturas (cart)", () => {
    test("rejects requests without a token", async () => {
        const res = await request(app).get("/api/facturas")
        expect(res.status).toBe(401)
    })

    test("GET / returns the books of the pending factura", async () => {
        facturaRepository.getPendingFacture.mockResolvedValue([{ id: 20 }])
        facturaRepository.getLibros.mockResolvedValue([bookRow({ id: 1, cantidad: 2 })])

        const res = await request(app).get("/api/facturas").set(auth)

        expect(res.status).toBe(200)
        expect(facturaRepository.getPendingFacture).toHaveBeenCalledWith({ cliente_id: testClient.id })
        expect(facturaRepository.add).not.toHaveBeenCalled()
        expect(facturaRepository.getLibros).toHaveBeenCalledWith({ factura_id: 20 })
        expect(res.body.body).toEqual([{ id: 1, cantidad: 2 }])
    })

    test("GET / creates a factura when the client has no pending one", async () => {
        facturaRepository.getPendingFacture.mockResolvedValue([])
        facturaRepository.add.mockResolvedValue({ insertId: 33 })
        facturaRepository.getLibros.mockResolvedValue([])

        const res = await request(app).get("/api/facturas").set(auth)

        expect(facturaRepository.add).toHaveBeenCalledWith({ cliente_id: testClient.id })
        expect(facturaRepository.getLibros).toHaveBeenCalledWith({ factura_id: 33 })
        expect(res.body.body).toEqual([])
    })

    test("POST /book/:id adds the book to the pending factura", async () => {
        facturaRepository.getPendingFacture.mockResolvedValue([{ id: 20 }])
        facturaRepository.addLibro.mockResolvedValue({})

        const res = await request(app).post("/api/facturas/book/9").set(auth)

        expect(res.status).toBe(200)
        expect(res.body.body).toBe("Libro añadido al carrito")
        expect(facturaRepository.addLibro).toHaveBeenCalledWith({ factura_id: 20, libro_id: "9" })
    })

    test("DELETE /book/:id removes the book with a numeric id", async () => {
        facturaRepository.getPendingFacture.mockResolvedValue([{ id: 20 }])
        facturaRepository.removeLibro.mockResolvedValue({})

        const res = await request(app).delete("/api/facturas/book/9").set(auth)

        expect(res.status).toBe(200)
        expect(res.body.body).toBe("Libro quitado del carrito")
        expect(facturaRepository.removeLibro).toHaveBeenCalledWith({ factura_id: 20, libro_id: 9 })
    })

    test("POST /book/:id returns 500 when adding fails", async () => {
        facturaRepository.getPendingFacture.mockResolvedValue([{ id: 20 }])
        facturaRepository.addLibro.mockRejectedValue(new Error("db down"))

        const res = await request(app).post("/api/facturas/book/9").set(auth)

        expect(res.status).toBe(500)
        expect(res.body.body).toBe("Error interno")
    })
})
