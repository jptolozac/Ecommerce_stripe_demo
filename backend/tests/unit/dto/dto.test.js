const { Autor } = require("../../../src/dto/autor.dto")
const { Categoria } = require("../../../src/dto/categoria.dto")
const { ClienteDTO } = require("../../../src/dto/cliente.dto")
const { Libro } = require("../../../src/dto/libro.dto")
const { LoginDTO } = require("../../../src/dto/login.dto")
const { PagoDTO } = require("../../../src/dto/pago.dto")

describe("DTOs keep only their own fields", () => {
    test("Autor", () => {
        expect({ ...new Autor({ id: 1, nombre: "Gabo", pais_origen: "Colombia" }) })
            .toEqual({ nombre: "Gabo", pais_origen: "Colombia" })
    })

    test("Categoria", () => {
        expect({ ...new Categoria({ id: 2, nombre: "Novela", extra: true }) }).toEqual({ id: 2, nombre: "Novela" })
    })

    test("ClienteDTO drops id and unknown fields", () => {
        const data = { id: 9, nombre: "Ana", telefono: "1", direccion: "d", correo: "a@b.co", password: "p", rol: "admin" }
        expect({ ...new ClienteDTO(data) }).toEqual({ nombre: "Ana", telefono: "1", direccion: "d", correo: "a@b.co", password: "p" })
    })

    test("LoginDTO", () => {
        expect({ ...new LoginDTO({ correo: "a@b.co", password: "p", foo: 1 }) }).toEqual({ correo: "a@b.co", password: "p" })
    })

    test("Libro", () => {
        const libro = new Libro({ id: 1, titulo: "T", autor_id: 3, cantidad: 2 })
        expect(libro.titulo).toBe("T")
        expect(libro.cantidad).toBe(2)
        expect(libro).not.toHaveProperty("autor_id")
    })
})

describe("PagoDTO", () => {
    test("trims the client email", () => {
        expect(new PagoDTO({ client_email: "  ana@test.com " }).client_email).toBe("ana@test.com")
    })

    test("throws when client_email is missing", () => {
        expect(() => new PagoDTO({})).toThrow(TypeError)
    })
})
