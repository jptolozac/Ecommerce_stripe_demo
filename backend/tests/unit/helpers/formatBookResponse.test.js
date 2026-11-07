jest.mock("../../../src/controllers/autor.controller", () => ({ get: jest.fn() }))
jest.mock("../../../src/controllers/categoria.controller", () => ({ getByBook: jest.fn() }))

const autorController = require("../../../src/controllers/autor.controller")
const categoriaController = require("../../../src/controllers/categoria.controller")
const formatBookResponse = require("../../../src/helpers/formatBookResponse.helper")
const { Libro } = require("../../../src/dto/libro.dto")
const { bookRow } = require("../../helpers/fixtures")

describe("formatBookResponse", () => {
    test("replaces autor_id with the author and adds category names", async () => {
        categoriaController.getByBook.mockResolvedValue([{ id: 1, nombre: "Novela" }, { id: 2, nombre: "Clásicos" }])
        autorController.get.mockResolvedValue([{ id: 3, nombre: "Gabriel García Márquez", pais_origen: "Colombia" }])
        const req = {}, res = {}

        const result = await formatBookResponse(req, res, bookRow({ cantidad: 2 }))

        expect(categoriaController.getByBook).toHaveBeenCalledWith(req, res, 1)
        expect(autorController.get).toHaveBeenCalledWith(req, res, 3)
        expect(result).toBeInstanceOf(Libro)
        expect(result).toMatchObject({
            id: 1,
            titulo: "Cien años de soledad",
            precio: 45000,
            cantidad: 2,
            categorias: ["Novela", "Clásicos"],
            autor: { nombre: "Gabriel García Márquez", pais_origen: "Colombia" },
        })
        expect(result).not.toHaveProperty("autor_id")
    })

    test("returns an empty category list when the book has none", async () => {
        categoriaController.getByBook.mockResolvedValue([])
        autorController.get.mockResolvedValue([{ nombre: "Anónimo", pais_origen: null }])

        const result = await formatBookResponse({}, {}, bookRow())

        expect(result.categorias).toEqual([])
    })
})
