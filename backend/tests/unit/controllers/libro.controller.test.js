jest.mock("../../../src/repository/libro.repository")
jest.mock("../../../src/helpers/formatBookResponse.helper")

const request = require("supertest")
const libroRepository = require("../../../src/repository/libro.repository")
const formatBookResponse = require("../../../src/helpers/formatBookResponse.helper")
const libroController = require("../../../src/controllers/libro.controller")
const buildApp = require("../../helpers/buildApp")
const { bookRow } = require("../../helpers/fixtures")

const app = buildApp("/api/libros", libroController)

beforeEach(() => {
    formatBookResponse.mockImplementation(async (req, res, book) => ({ id: book.id, formatted: true }))
})

describe("GET /api/libros", () => {
    test("lists all books formatted", async () => {
        libroRepository.getAll.mockResolvedValue([bookRow({ id: 1 }), bookRow({ id: 2 })])

        const res = await request(app).get("/api/libros")

        expect(res.status).toBe(200)
        expect(res.body.body).toEqual([{ id: 1, formatted: true }, { id: 2, formatted: true }])
        expect(libroRepository.findByText).not.toHaveBeenCalled()
    })

    test("searches by text when q is given", async () => {
        libroRepository.findByText.mockResolvedValue([bookRow({ id: 5 })])

        const res = await request(app).get("/api/libros").query({ q: "macondo" })

        expect(libroRepository.findByText).toHaveBeenCalledWith("macondo")
        expect(libroRepository.getAll).not.toHaveBeenCalled()
        expect(res.body.body).toEqual([{ id: 5, formatted: true }])
    })

    test("returns 500 when the repository fails", async () => {
        libroRepository.getAll.mockRejectedValue(new Error("db down"))
        const res = await request(app).get("/api/libros")
        expect(res.status).toBe(500)
    })
})

describe("other book routes", () => {
    test("GET /categorias/:categoria filters by category", async () => {
        libroRepository.getByCategory.mockResolvedValue([bookRow({ id: 3 })])

        const res = await request(app).get("/api/libros/categorias/Novela")

        expect(libroRepository.getByCategory).toHaveBeenCalledWith("Novela")
        expect(res.body.body).toEqual([{ id: 3, formatted: true }])
    })

    test.each([
        ["/libros_mas_vendidos", "getBestSellingBooks"],
        ["/libros_mas_vendidos_2024", "getBestSellingBooksReleasedIn2024"],
    ])("GET %s uses %s", async (path, fn) => {
        libroRepository[fn].mockResolvedValue([bookRow()])

        const res = await request(app).get(`/api/libros${path}`)

        expect(res.status).toBe(200)
        expect(libroRepository[fn]).toHaveBeenCalled()
        expect(libroRepository.get).not.toHaveBeenCalled()
    })

    test("GET /libros_mas_vendidos returns a generic 500 on failure", async () => {
        libroRepository.getBestSellingBooks.mockRejectedValue(new Error("db down"))
        const res = await request(app).get("/api/libros/libros_mas_vendidos")
        expect(res.status).toBe(500)
        expect(res.body.body).toBe("Error interno")
    })

    test("GET /:id returns a single formatted book", async () => {
        libroRepository.get.mockResolvedValue([bookRow({ id: 8 })])

        const res = await request(app).get("/api/libros/8")

        expect(libroRepository.get).toHaveBeenCalledWith("8")
        expect(res.body.body).toEqual({ id: 8, formatted: true })
    })
})
