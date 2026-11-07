const security = require("../../../src/middlewares/security")
const { bearer, testClient } = require("../../helpers/tokens")
const { mockRes } = require("../../helpers/fixtures")

describe("security middleware", () => {
    test("calls next and sets req.user when the token is valid", () => {
        const req = { headers: { authorization: bearer() } }
        const res = mockRes()
        const next = jest.fn()

        security(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(req.user).toMatchObject(testClient)
        expect(res.status).not.toHaveBeenCalled()
    })

    test("responds 401 with the auth error when the token is missing", () => {
        const res = mockRes()
        const next = jest.fn()

        security({ headers: {} }, res, next)

        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith({ error: true, status: 401, body: "Sin token relacionado" })
    })

    test("responds 401 when the token is invalid", () => {
        const res = mockRes()
        security({ headers: { authorization: "Bearer bad" } }, res, jest.fn())
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ status: 401, body: "Token inválido" }))
    })
})
