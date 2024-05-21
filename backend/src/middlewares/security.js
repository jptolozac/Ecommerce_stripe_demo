const auth = require("../auth/index")
const response = require("../responses/response")

function security(req, res, next){
    try {
        auth.getDecodedToken(req)
        next()
    } catch (error) {
        response.error(req, res, error.message, 401)
    }
}

module.exports = security