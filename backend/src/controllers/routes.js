const express = require("express")
const config = require("../config")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
const loginController = require("./login.controller")
const security = require("../middlewares/security")

const clienteController = require("./cliente.controller")
const libroController = require("./libro.controller")
const categoriaController = require("./categoria.controller").router
const facturaController = require("./facturaController.controller")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
/* app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next()
}) */


//middleware
app.use(morgan(':status :method :url :res[content-length] - :response-time ms :date'))

app.set("port", config.app.port)

app.use('/api', loginController)

app.use('/api/clientes', security, clienteController)
app.use('/api/libros'/* , security */, libroController)
app.use('/api/categorias'/* , security */, categoriaController)
app.use('/api/facturas', security, facturaController)



module.exports = app;