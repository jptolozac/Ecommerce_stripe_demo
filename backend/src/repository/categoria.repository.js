const { con } = require("./connection")

const table = "categoria"

function getAll(){
    return new Promise((resolve, reject) => con.query(`SELECT * FROM ${table} LIMIT 30`, (error, result) => {
        if(error) reject(error)
        // console.log("result: ", result)
        resolve(result)
    }))
}

function findAll(category){
    return new Promise((resolve, reject) => con.query(`SELECT * FROM ${table} WHERE ${table}.nombre LIKE CONCAT('%',?,'%') LIMIT 30`, category, (error, result) => {
        if(error) reject(error)
        resolve(result)
    }))
}

function getByBook(id){
    return new Promise((resolve, reject) => con.query(`SELECT cat.nombre FROM categoria cat join categoria_libro cl on (cat.id = cl.categoria_id) join libro lb on (lb.id = cl.libro_id) WHERE lb.id=?`, id, (error, result) => {
        if(error) reject(error)
        resolve(result)
    }))
}

function get(id){
    return new Promise((resolve, reject) => con.query(`SELECT * FROM ${table} WHERE id=?`, id, (error, result) => {
        if(error) reject(error)
        resolve(result)
    }))
}

function add(data){
    
    return new Promise((resolve, reject) => con.query(`INSERT INTO ${table} SET ?`, data, (error, response) => {
        if(error) reject(error)
        resolve(response)
    }))
}

function update(id, data){
    return new Promise((resolve, reject) => con.query(`UPDATE ${table} SET ? where id=?`, [data, id], (error, results) => {
        if(error) reject(error)
        resolve(results)
    }))
}

function destroy(id){
    return new Promise((resolve, reject) => con.query(`DELETE FROM ${table} WHERE id=?`, id, (error, result) => {
        if(error) reject(error)
        resolve(result)
    }))
}

module.exports = { getAll, findAll, getByBook, get, add, update, destroy }