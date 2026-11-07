const response = require("../../../src/responses/response")
const { mockRes } = require("../../helpers/fixtures")

describe("response.success", () => {
    test("sends 200 with the body by default", () => {
        const res = mockRes()
        response.success({}, res, { ok: 1 })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({ error: false, status: 200, body: { ok: 1 } })
    })

    test("uses the given status and an empty message by default", () => {
        const res = mockRes()
        response.success({}, res, undefined, 201)
        expect(res.send).toHaveBeenCalledWith({ error: false, status: 201, body: "" })
    })
})

describe("response.error", () => {
    test("sends 500 with a generic message by default", () => {
        const res = mockRes()
        response.error({}, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({ error: true, status: 500, body: "Error en el servidor" })
    })

    test("uses the given message and status", () => {
        const res = mockRes()
        response.error({}, res, "No autorizado", 401)
        expect(res.send).toHaveBeenCalledWith({ error: true, status: 401, body: "No autorizado" })
    })
})
