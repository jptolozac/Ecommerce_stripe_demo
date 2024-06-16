const express = require("express")
const security = require("../middlewares/security")
const response = require("../responses/response")
const { getDecodedToken } = require("../auth")
const router = express.Router()
const facturaRepository = require("../repository/factura.repository")
const config = require("../config")
const Stripe = require("stripe")
const stripe = new Stripe(config.stripe.secret)


router.post('/proceedToPayment', security, proceedToPayment)
router.get('/successfulPayment', successfulPayment)
router.get('/paymentCanceled', paymentCanceled)

async function getFacture(req, res) {
    try {
        const client = getDecodedToken(req)
        let facturaId = await facturaRepository.getPendingFacture({ cliente_id: client.id })
        if (facturaId.length < 1) {
            const newFactura = await facturaRepository.add({ cliente_id: client.id })
            facturaId = newFactura.insertId
        } else {
            facturaId = facturaId[0].id
        }
        return facturaId;
    } catch (error) {
        console.log(error);
        response.error(req, res, "Error interno");
        return;
    }
}

// Pasarela de pagos (Aún no implementada)
async function proceedToPayment(req, res) {
    try {
        const facturaId = await getFacture(req, res)
        await facturaRepository.updateTotal({ factura_id: facturaId })
        const booksInCart = await facturaRepository.getLibros({ factura_id: facturaId })
        const session = await createSession(req, booksInCart)

        response.success(req, res, session)
    } catch (error) {
        console.log(error);
        response.error(req, res, "Error interno");
    }
}

async function createSession(req, booksInCart) {
    const success_url = `${config.app.protocol}://${config.app.domain}${req.baseUrl}/successfulPayment`
    const cancel_url = `${config.app.protocol}://${config.app.domain}${req.baseUrl}/paymentCanceled`

    const items = booksInCart.map(book => ({
        price_data: {
            product_data: {
                name: book.titulo,
                description: book.sinopsis.slice(100) + '...'
            },
            currency: 'cop',
            unit_amount: parseInt(book.precio + "00")
        },
        quantity: book.cantidad
    }))

    const session = await stripe.checkout.sessions.create({
        line_items: items,
        mode: 'payment',
        success_url,
        cancel_url
    })

    
    return session
}

function successfulPayment(req, res){
    res.status(200).json({
        message: "holi"
    })
}

function paymentCanceled(req, res){
    res.status(200).json({
        message: "Pailas su pago"
    })
}

module.exports = router