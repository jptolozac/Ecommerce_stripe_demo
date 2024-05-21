exports.success = (req, res, message = '', status = 200) => {
    res.status(status).send({
        error: false,
        status: status,
        body: message
    })
}

exports.error = (req, res, message = 'Error en el servidor', status = 500) => {
    res.status(status).send({
        error: true,
        status: status,
        body: message
    })
}