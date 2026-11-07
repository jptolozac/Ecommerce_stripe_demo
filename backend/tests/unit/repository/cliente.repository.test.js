jest.mock("../../../src/repository/connection", () => ({ con: { query: jest.fn() } }))

const { con } = require("../../../src/repository/connection")
const clienteRepository = require("../../../src/repository/cliente.repository")

function queryResolves(result) {
    con.query.mockImplementation((...args) => args.at(-1)(null, result))
}

describe("cliente.repository", () => {
    test("getAll limits the result to 30 rows", async () => {
        queryResolves([{ id: 1 }])
        await expect(clienteRepository.getAll()).resolves.toEqual([{ id: 1 }])
        expect(con.query.mock.calls[0][0]).toBe("SELECT * FROM cliente LIMIT 30")
    })

    test("get uses a placeholder for the id", async () => {
        queryResolves([])
        await clienteRepository.get("5")
        expect(con.query).toHaveBeenCalledWith("SELECT * FROM cliente WHERE id=?", "5", expect.any(Function))
    })

    test("getByEmail queries by correo", async () => {
        queryResolves([])
        await clienteRepository.getByEmail({ correo: "ana@test.com", password: "x" })
        expect(con.query.mock.calls[0].slice(0, 2)).toEqual(["SELECT * FROM cliente WHERE correo=?", "ana@test.com"])
    })

    test("update passes data and id in that order", async () => {
        queryResolves({ affectedRows: 1 })
        await clienteRepository.update(3, { nombre: "Ana" })
        expect(con.query.mock.calls[0].slice(0, 2)).toEqual(["UPDATE cliente SET ? where id=?", [{ nombre: "Ana" }, 3]])
    })

    test("destroy deletes by id", async () => {
        queryResolves({ affectedRows: 1 })
        await clienteRepository.destroy(3)
        expect(con.query.mock.calls[0].slice(0, 2)).toEqual(["DELETE FROM cliente WHERE id=?", 3])
    })

    test("rejects when the query fails", async () => {
        con.query.mockImplementation((...args) => args.at(-1)(new Error("ER_DUP_ENTRY")))
        await expect(clienteRepository.add({ correo: "dup@test.com" })).rejects.toThrow("ER_DUP_ENTRY")
    })
})
