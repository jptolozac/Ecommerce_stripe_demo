jest.mock("../../../src/repository/connection", () => ({ con: { query: jest.fn() } }))

const { con } = require("../../../src/repository/connection")
const facturaRepository = require("../../../src/repository/factura.repository")

// Makes con.query answer through its callback, like mysql2 does
function queryResolves(result) {
    con.query.mockImplementation((...args) => args.at(-1)(null, result))
}

function queryFails(error) {
    con.query.mockImplementation((...args) => args.at(-1)(error))
}

describe("factura.repository", () => {
    test("addLibro inserts the factura/libro pair", async () => {
        queryResolves({ insertId: 1 })
        await expect(facturaRepository.addLibro({ factura_id: 4, libro_id: 9 })).resolves.toEqual({ insertId: 1 })
        expect(con.query).toHaveBeenCalledWith("INSERT INTO factura_libro SET ?", { factura_id: 4, libro_id: 9 }, expect.any(Function))
    })

    test("removeLibro deletes a single copy using the lowercase table name", async () => {
        queryResolves({ affectedRows: 1 })
        await facturaRepository.removeLibro({ factura_id: 4, libro_id: 9 })
        const [sql, params] = con.query.mock.calls[0]
        expect(sql).toBe("DELETE FROM factura_libro WHERE libro_id=? AND factura_id=? LIMIT 1;")
        expect(params).toEqual([9, 4])
    })

    test("add creates a pending factura (estado 1) for the client", async () => {
        queryResolves({ insertId: 15 })
        await expect(facturaRepository.add({ cliente_id: 7 })).resolves.toEqual({ insertId: 15 })
        expect(con.query.mock.calls[0][1]).toEqual({ cliente_id: 7, estado_factura_id: 1 })
    })

    test("getPendingFacture filters by client and estado 1", async () => {
        queryResolves([{ id: 3 }])
        await expect(facturaRepository.getPendingFacture({ cliente_id: 7 })).resolves.toEqual([{ id: 3 }])
        const [sql, param] = con.query.mock.calls[0]
        expect(sql).toMatch(/cliente_id=\? and estado_factura_id=1/)
        expect(param).toBe(7)
    })

    test("getLibros parses the factura id", async () => {
        queryResolves([])
        await facturaRepository.getLibros({ factura_id: "12" })
        expect(con.query.mock.calls[0][1]).toBe(12)
    })

    test("updateTotal only references the aliases it declares (aliases are case-sensitive on Linux)", async () => {
        queryResolves({ affectedRows: 1 })
        await facturaRepository.updateTotal({ factura_id: 5 })
        const [sql, param] = con.query.mock.calls[0]
        expect(sql).toContain("factura_libro fl JOIN libro lb")
        const usedAliases = [...sql.matchAll(/\b([A-Za-z]+)\.(?:factura_id|libro_id|id|precio)\b/g)].map(m => m[1])
        expect(usedAliases.every(alias => ["fl", "lb", "factura"].includes(alias))).toBe(true)
        expect(param).toBe(5)
    })

    test.each([
        ["completeSuccessfulPayment", 2],
        ["cancelPayment", 3],
    ])("%s sets estado_factura_id=%i", async (fn, estado) => {
        queryResolves({ affectedRows: 1 })
        await facturaRepository[fn]({ factura_id: 5 })
        const [sql, param] = con.query.mock.calls[0]
        expect(sql).toContain(`estado_factura_id=${estado}`)
        expect(param).toBe(5)
    })

    test("rejects when the query fails", async () => {
        const error = new Error("ER_NO_SUCH_TABLE")
        queryFails(error)
        await expect(facturaRepository.getPendingFacture({ cliente_id: 1 })).rejects.toBe(error)
    })
})
