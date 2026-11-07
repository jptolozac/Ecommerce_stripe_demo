// Raw book row as the libro table and views return it
function bookRow(overrides = {}) {
    return {
        id: 1,
        titulo: "Cien años de soledad",
        publicacion_year: 1967,
        disponibilidad: 1,
        sinopsis: "La historia de la familia Buendía en Macondo.",
        precio: 45000,
        autor_id: 3,
        ventas: 120,
        imagen_url: "http://img/1.jpg",
        ...overrides,
    }
}

// Minimal Express res double for testing middlewares/handlers directly
function mockRes() {
    const res = {}
    res.status = jest.fn(() => res)
    res.send = jest.fn(() => res)
    return res
}

module.exports = { bookRow, mockRes }
