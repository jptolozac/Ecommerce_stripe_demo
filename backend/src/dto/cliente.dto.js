class ClienteDTO {
    nombre;
    telefono;
    direccion;
    correo;
    password;

    constructor(data){
        this.nombre = data.nombre
        this.telefono = data.telefono
        this.direccion = data.direccion
        this.correo = data.correo
        this.password = data.password
    }
}

module.exports = { ClienteDTO }