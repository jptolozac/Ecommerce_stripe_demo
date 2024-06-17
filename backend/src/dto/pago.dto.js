class PagoDTO{
    client_email;

    constructor(data){
        this.client_email = data.client_email.trim()
    }
}

module.exports = { PagoDTO }