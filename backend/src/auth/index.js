const jwt = require("jsonwebtoken")
const config = require("../config")

function asignToken(data){
    return jwt.sign(JSON.stringify(data), config.jwt.secret)
}

function verifyToken(token){
    try {
        return jwt.verify(token, config.jwt.secret)
    } catch (error) {
        throw new Error('Token inválido')
    }
}

function getEncodedToken(authorization){
    if(!authorization)
        throw new Error("Sin token relacionado")
    if(authorization.indexOf('Bearer') === -1){
        throw new Error("Formato inválido")
    }

    return authorization.replace('Bearer ', '').trim()
}

function getDecodedToken(req){
    const autorization = req.headers.authorization;
    const token = getEncodedToken(autorization);
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    return decodedToken
}


module.exports = { asignToken, getDecodedToken }