const { Libro } = require("../dto/libro.dto");
const { Autor } = require("../dto/autor.dto");
const autorController = require("../controllers/autor.controller")
const categoriaController = require("../controllers/categoria.controller")

async function formatBookResponse(req, res, book) {
    let categorias = await categoriaController.getByBook(req, res, book.id)
    categorias = categorias.map(categoria => categoria.nombre)

    let autor = await autorController.get(req, res, book.autor_id)
    autor = new Autor(autor[0])

    const formatedBook = new Libro({
        id: book.id,
        titulo: book.titulo,
        publicacion_year: book.publicacion_year,
        disponibilidad: book.disponibilidad,
        sinopsis: book.sinopsis,
        precio: book.precio,
        autor: autor,
        categorias: categorias,
        ventas: book.ventas,
        imagen_url: book.imagen_url
    });

    return formatedBook;
}

module.exports = formatBookResponse