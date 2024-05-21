const { faker } = require("@faker-js/faker")
const categoriaRepository = require("../repository/categoria.repository")

function generateData(cant){
    const categorias = new Array(cant)
    return categorias.map(categoria => ({
        nombre: faker.animal
    }))
}