jest.mock("../../../src/repository/categoria.repository")

const request = require("supertest")
const categoriaRepository = require("../../../src/repository/categoria.repository")
const { router, getByBook } = require("../../../src/controllers/categoria.controller")
const buildApp = require("../../helpers/buildApp")
const { mockRes } = require("../../helpers/fixtures")

const app = buildApp("/api/categorias", router)

describe("/api/categorias", () => {
    test("GET / maps rows to Categoria (id, nombre)", async () => {
        categoriaRepository.getAll.mockResolvedValue([{ id: 1, nombre: "Novela", descripcion: "x" }])

        const res = await request(app).get("/api/categorias")

        expect(res.status).toBe(200)
        expect(res.body.body).toEqual([{ id: 1, nombre: "Novela" }])
    })

    test("GET /:id returns one category", async () => {
        categoriaRepository.get.mockResolvedValue([{ id: 2, nombre: "Poesía" }])

        const res = await request(app).get("/api/categorias/2")

        expect(categoriaRepository.get).toHaveBeenCalledWith("2")
        expect(res.body.body).toEqual({ id: 2, nombre: "Poesía" })
    })

    test("GET / returns 500 when the repository fails", async () => {
        categoriaRepository.getAll.mockRejectedValue(new Error("db down"))
        const res = await request(app).get("/api/categorias")
        expect(res.status).toBe(500)
    })
})

describe("getByBook", () => {
    test("returns the categories of a book", async () => {
        categoriaRepository.getByBook.mockResolvedValue([{ id: 1, nombre: "Novela" }])
        await expect(getByBook({}, mockRes(), 4)).resolves.toEqual([{ id: 1, nombre: "Novela" }])
        expect(categoriaRepository.getByBook).toHaveBeenCalledWith(4)
    })

    test("responds 500 and returns undefined when the repository fails", async () => {
        categoriaRepository.getByBook.mockRejectedValue(new Error("db down"))
        const res = mockRes()
        await expect(getByBook({}, res, 4)).resolves.toBeUndefined()
        expect(res.status).toHaveBeenCalledWith(500)
    })
})
