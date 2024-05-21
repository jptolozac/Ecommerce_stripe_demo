class LoginDTO{
    correo;
    password;

    constructor(data){
        this.correo = data.correo
        this.password = data.password
    }
}

module.exports = { LoginDTO }