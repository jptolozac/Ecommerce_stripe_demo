const express = require("express")
const router = express.Router()

const response = require("../responses/response");
const facturaRepository = require("../repository/factura.repository")
const formatBookResponse = require("../helpers/formatBookResponse.helper")
const { getDecodedToken } = require("../auth/index");
// const { ClienteDTO } = require("../dto/cliente.dto");


router.get(['', '/'], getBooks)
router.post('/book/:id', addBook)
router.delete('/book/:id', removeBook)



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

async function getBooks(req, res) {
    try {
        const facturaId = await getFacture(req, res);
        let libros = await facturaRepository.getLibros({ factura_id: facturaId })
        libros = await Promise.all(libros.map(async (libro) => await formatBookResponse(req, res, libro)));
        console.log("factura: ", facturaId);
        console.log("libros: ", libros);
        response.success(req, res, libros);
    } catch (error) {
        console.log(error);
        response.error(req, res, "Error interno");
    }
}

async function addBook(req, res) {
    try {
        const facturaId = await getFacture(req, res)
        await facturaRepository.addLibro({ factura_id: facturaId, libro_id: req.params.id })

        response.success(req, res, "Libro añadido al carrito")
    } catch (error) {
        console.log(error);
        response.error(req, res, "Error interno");
    }
}

async function removeBook(req, res) {
    try {
        const facturaId = await getFacture(req, res)
        await facturaRepository.removeLibro({ factura_id: facturaId, libro_id: parseInt(req.params.id) })

        response.success(req, res, "Libro quitado del carrito")
    } catch (error) {
        console.log(error);
        response.error(req, res, "Error interno");
    }
}


module.exports = router