class Libro {
    id;
    titulo;
    publicacion_year;
    disponibilidad;
    sinopsis;
    precio;
    autor;
    categorias;
    ventas;
    imagen_url;

    constructor(data){
        this.id = data.id;
        this.titulo = data.titulo;
        this.publicacion_year = data.publicacion_year;
        this.disponibilidad = data.disponibilidad;
        this.sinopsis = data.sinopsis;
        this.precio = data.precio;
        this.autor = data.autor;
        this.categorias = data.categorias;
        this.ventas = data.ventas;
        this.imagen_url = data.imagen_url;
    }
}

module.exports = { Libro }
