const jwt = require("jsonwebtoken")
const auth = require("../../../src/auth")
const { testClient } = require("../../helpers/tokens")

describe("asignToken", () => {
    test("signs the data with JWT_SECRET", () => {
        const token = auth.asignToken(testClient)
        expect(jwt.verify(token, process.env.JWT_SECRET)).toEqual(testClient)
    })
})

describe("getDecodedToken", () => {
    const reqWith = (authorization) => ({ headers: { authorization } })

    test("decodes a valid Bearer token and stores it in req.user", () => {
        const req = reqWith(`Bearer ${auth.asignToken(testClient)}`)
        const decoded = auth.getDecodedToken(req)
        expect(decoded).toEqual(testClient)
        expect(req.user).toEqual(testClient)
    })

    test("throws when there is no Authorization header", () => {
        expect(() => auth.getDecodedToken(reqWith(undefined))).toThrow("Sin token relacionado")
    })

    test("throws when the header is not a Bearer token", () => {
        expect(() => auth.getDecodedToken(reqWith("Basic abc"))).toThrow("Formato inválido")
    })

    test("throws when the token is signed with another secret", () => {
        const forged = jwt.sign(testClient, "other-secret")
        expect(() => auth.getDecodedToken(reqWith(`Bearer ${forged}`))).toThrow("Token inválido")
    })

    test("throws when the token is malformed", () => {
        expect(() => auth.getDecodedToken(reqWith("Bearer not.a.jwt"))).toThrow("Token inválido")
    })
})
