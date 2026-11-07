jest.mock("../../../src/repository/factura.repository")
jest.mock("../../../src/repository/cliente.repository")

const request = require("supertest")
const buildApp = require("../../helpers/buildApp")
const { bearer, testClient } = require("../../helpers/tokens")
const { bookRow } = require("../../helpers/fixtures")

// pago.controller creates the Stripe client when it is loaded, so each scenario
// loads a fresh copy of the module with the env it needs
function loadPagoApp({ stripeSecret = "", createSession } = {}) {
    let app, facturaRepository, clienteRepository
    jest.isolateModules(() => {
        process.env.STRIPE_SECRET = stripeSecret
        if (createSession) {
            jest.doMock("stripe", () => jest.fn(() => ({ checkout: { sessions: { create: createSession } } })))
        }
        facturaRepository = require("../../../src/repository/factura.repository")
        clienteRepository = require("../../../src/repository/cliente.repository")
        app = buildApp("/api/pagos", require("../../../src/controllers/pago.controller"))
    })
    return { app, facturaRepository, clienteRepository }
}

afterEach(() => {
    process.env.STRIPE_SECRET = ""
    jest.dontMock("stripe")
})

describe("POST /api/pagos/proceedToPayment", () => {
    test("returns 401 without a token", async () => {
        const { app } = loadPagoApp()
        const res = await request(app).post("/api/pagos/proceedToPayment")
        expect(res.status).toBe(401)
    })

    test("returns 503 when STRIPE_SECRET is not configured", async () => {
        const { app, facturaRepository } = loadPagoApp()

        const res = await request(app).post("/api/pagos/proceedToPayment").set("Authorization", bearer())

        expect(res.status).toBe(503)
        expect(res.body.body).toBe("Pasarela de pagos no configurada")
        expect(facturaRepository.getPendingFacture).not.toHaveBeenCalled()
    })

    test("creates a Stripe checkout session with the cart and returns its url", async () => {
        const createSession = jest.fn().mockResolvedValue({ url: "https://checkout.stripe.test/s/1" })
        const { app, facturaRepository } = loadPagoApp({ stripeSecret: "sk_test_dummy", createSession })
        facturaRepository.getPendingFacture.mockResolvedValue([{ id: 20 }])
        facturaRepository.updateTotal.mockResolvedValue({})
        facturaRepository.getLibros.mockResolvedValue([bookRow({ precio: 45000, cantidad: 2 })])

        const res = await request(app).post("/api/pagos/proceedToPayment").set("Authorization", bearer())

        expect(res.status).toBe(200)
        expect(res.body.body).toBe("https://checkout.stripe.test/s/1")
        expect(facturaRepository.updateTotal).toHaveBeenCalledWith({ factura_id: 20 })

        const session = createSession.mock.calls[0][0]
        expect(session.mode).toBe("payment")
        expect(session.line_items).toEqual([
            expect.objectContaining({
                quantity: 2,
                price_data: expect.objectContaining({
                    currency: "cop",
                    unit_amount: 4500000,
                    product_data: expect.objectContaining({ name: "Cien años de soledad" }),
                }),
            }),
        ])
        expect(session.success_url).toBe(`http://localhost:3000/api/pagos/successfulPayment?client_email=${testClient.correo}`)
        expect(session.cancel_url).toBe(`http://localhost:3000/api/pagos/paymentCanceled?client_email=${testClient.correo}`)
    })

    test.each([
        ["keeps a short synopsis as is", "Una novela corta.", "Una novela corta."],
        ["truncates a long synopsis to its first 100 chars", "a".repeat(150), "a".repeat(100) + "..."],
        ["omits the description when the synopsis is empty", "   ", undefined],
        ["omits the description when there is no synopsis", null, undefined],
    ])("%s", async (_name, sinopsis, expected) => {
        const createSession = jest.fn().mockResolvedValue({ url: "https://checkout.stripe.test/s/2" })
        const { app, facturaRepository } = loadPagoApp({ stripeSecret: "sk_test_dummy", createSession })
        facturaRepository.getPendingFacture.mockResolvedValue([{ id: 20 }])
        facturaRepository.getLibros.mockResolvedValue([bookRow({ sinopsis, cantidad: 1 })])

        await request(app).post("/api/pagos/proceedToPayment").set("Authorization", bearer())

        const productData = createSession.mock.calls[0][0].line_items[0].price_data.product_data
        expect(productData.description).toBe(expected)
    })

    test("returns 500 when Stripe fails", async () => {
        const createSession = jest.fn().mockRejectedValue(new Error("stripe down"))
        const { app, facturaRepository } = loadPagoApp({ stripeSecret: "sk_test_dummy", createSession })
        facturaRepository.getPendingFacture.mockResolvedValue([{ id: 20 }])
        facturaRepository.getLibros.mockResolvedValue([bookRow({ cantidad: 1 })])

        const res = await request(app).post("/api/pagos/proceedToPayment").set("Authorization", bearer())

        expect(res.status).toBe(500)
    })
})

describe.each([
    ["successfulPayment", "completeSuccessfulPayment", "completed"],
    ["paymentCanceled", "cancelPayment", "canceled"],
])("GET /api/pagos/%s", (path, repoFn, status) => {
    test(`marks the factura with ${repoFn} and redirects to the frontend`, async () => {
        const { app, facturaRepository, clienteRepository } = loadPagoApp()
        clienteRepository.getByEmail.mockResolvedValue([{ id: 7 }])
        facturaRepository.getPendingFacture.mockResolvedValue([{ id: 20 }])
        facturaRepository[repoFn].mockResolvedValue({})

        const res = await request(app).get(`/api/pagos/${path}`).query({ client_email: " ana@test.com " })

        expect(clienteRepository.getByEmail).toHaveBeenCalledWith({ correo: "ana@test.com" })
        expect(facturaRepository[repoFn]).toHaveBeenCalledWith({ factura_id: 20 })
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe(`http://localhost:5173/#/?paymentStatus=${status}`)
    })

    test("returns 400 when the client does not exist", async () => {
        const { app, facturaRepository, clienteRepository } = loadPagoApp()
        clienteRepository.getByEmail.mockResolvedValue([])

        const res = await request(app).get(`/api/pagos/${path}`).query({ client_email: "nadie@test.com" })

        expect(res.status).toBe(400)
        expect(facturaRepository[repoFn]).not.toHaveBeenCalled()
    })
})
