const express = require("express")
const security = require("../middlewares/security")
const response = require("../responses/response")
const { getDecodedToken } = require("../auth")
const router = express.Router()
const facturaRepository = require("../repository/factura.repository")
const clienteRepository = require("../repository/cliente.repository")
const config = require("../config")
const Stripe = require("stripe")
const { PagoDTO } = require("../dto/pago.dto")
const stripe = new Stripe(config.stripe.secret)

const FRONTEND_URL = config.app.frontendUrl


router.post('/proceedToPayment', security, proceedToPayment)
router.get('/successfulPayment', successfulPayment)
router.get('/paymentCanceled', paymentCanceled)

//returns the facture id from current client
async function getFacture(req, res, { client_email=null }={}) {
    try {
        let client = null
        console.log(client_email);
        if(client_email){
            client = await clienteRepository.getByEmail({ correo: client_email })
            client = client[0]
        }else{
            client = getDecodedToken(req)
        }
        if(!client) return null

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
        response.error(req, res, "Error interno getFacture");
        return;
    }
}

// Pasarela de pagos (Aún no implementada)
async function proceedToPayment(req, res) {
    try {
        const facturaId = await getFacture(req, res)
        await facturaRepository.updateTotal({ factura_id: facturaId })
        const booksInCart = await facturaRepository.getLibros({ factura_id: facturaId })
        const session = await createSession(req, res, booksInCart)

        response.success(req, res, session)
    } catch (error) {
        console.log(error);
        response.error(req, res, "Error interno");
    }
}

async function createSession(req, res, booksInCart) {
    const client_email = req.user.correo
    const success_url = `${config.app.protocol}://${config.app.domain}${req.baseUrl}/successfulPayment?client_email=${client_email}`
    const cancel_url = `${config.app.protocol}://${config.app.domain}${req.baseUrl}/paymentCanceled?client_email=${client_email}`

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
    const { url } = session
    
    return url
}

async function successfulPayment(req, res){
    const pago = new PagoDTO(req.query)
    const factura_id = await getFacture(req, res, { client_email: pago.client_email })
    if(!factura_id) 
        return response.error(req, res, "No se encuentra el cliente al que pertenece la factura", 400)
    
    await facturaRepository.completeSuccessfulPayment({ factura_id })

    return res.redirect(`${config.app.frontendUrl}/#/?paymentStatus=completed`)
}

async function paymentCanceled(req, res){
    const pago = new PagoDTO(req.query)
    const factura_id = await getFacture(req, res, { client_email: pago.client_email })
    if(!factura_id) 
        return response.error(req, res, "No se encuentra el cliente al que pertenece la factura", 400)
    
    await facturaRepository.cancelPayment({ factura_id })

    return res.redirect(`${config.app.frontendUrl}/#/?paymentStatus=canceled`)
}

module.exports = router