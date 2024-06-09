
export function shapePrevewBooks(books){
    return books.map(book => {
        const author = book.autor ? book.autor.nombre : "Autor desconocido"
        return {
        id: book.id,
        title: book.titulo,
        img: book.imagen_url,
        price: book.precio,
        author: author
    }})
}

export function shapeBooks(book){
    const author = book.autor ? book.autor.nombre : "Autor desconocido"
    const img = book.imagen_url || "http://dummyimage.com/370x450.png/5fa2dd/ffffff"
    const mapData = {
        id: book.id,
        title: book.titulo,
        img: img,
        author: author,
        synopsis: book.sinopsis,
        categories: book.categorias,
        publication_year: book.publicacion_year,
        disponibility: book.disponibilidad,
        price: book.precio,
        quantity: book.cantidad
    }
    return mapData
}