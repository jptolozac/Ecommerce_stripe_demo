class Autor {
    nombre;
    pais_origen;

    constructor(data){
        this.nombre = data.nombre;
        this.pais_origen = data.pais_origen;
    }
}

module.exports = { Autor }