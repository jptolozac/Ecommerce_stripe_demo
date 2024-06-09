const { con } = require("./connection")

const table = "factura"

function addLibro(data){ //{ factura_id, libro_id }
    return new Promise((resolve, reject) => con.query("INSERT INTO factura_libro SET ?", data, (error, result) => {
        if(error) reject(error)
        resolve(result)
    }))
}

function removeLibro({ factura_id, libro_id }){ //{ factura_id, libro_id }
    console.log({ factura_id, libro_id });
    return new Promise((resolve, reject) => con.query("DELETE FROM FACTURA_LIBRO WHERE LIBRO_ID=? AND FACTURA_ID=? LIMIT 1;", [libro_id, factura_id], (error, result) => {
        if(error) reject(error)
        resolve(result)
    }))
}

function add({ cliente_id }){
    return new Promise((resolve, reject) => con.query(`INSERT INTO ${table} SET ?`, {
        cliente_id,
        estado_factura_id: 1
    }, (error, result) => {
        if(error) reject(error)
        resolve(result)
    }))
}

function getLibros({ factura_id }){
    return new Promise((resolve, reject) => con.query("SELECT lb.*, count(lb.id) as cantidad FROM factura_libro fl join libro lb on (fl.libro_id=lb.id) where fl.factura_id=? group by lb.id", parseInt(factura_id), (error, result) => {
        if(error) reject(error)
        resolve(result)
    }))
}

function getPendingFacture({ cliente_id }){
    return new Promise((resolve, reject) => con.query(`SELECT id FROM ${table} where cliente_id=? and estado_factura_id=1 LIMIT 1`, cliente_id, (error, result) => {
        if(error) reject(error)
            resolve(result)
    }))
}

module.exports = { addLibro, removeLibro, add, getLibros, getPendingFacture }