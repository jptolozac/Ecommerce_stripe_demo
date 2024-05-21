const { con } = require("./connection")

const table = "libro"

function getAll(){
    return new Promise((resolve, reject) => con.query(`SELECT * FROM ${table} LIMIT 30`, (error, result) => {
        if(error) reject(error)
        // console.log("result: ", result)
        resolve(result)
    }))
}

function findByText(query){
    return new Promise((resolve, reject) => con.query(`SELECT lb.* FROM ${table} lb join autor au WHERE lb.sinopsis LIKE concat('%',?,'%') or lb.titulo LIKE concat('%',?,'%') or au.nombre LIKE concat('%',?,'%') LIMIT 30`, [query, query, query], (error, result) => {
        if(error) reject(error)
        resolve(result)
    }))
}

function getBestSellingBooks(){
    return new Promise((resolve, reject) => con.query(`SELECT * FROM libros_mas_vendidos LIMIT 30`, (error, result) => {
        if(error) reject(error)
        resolve(result)
    }))
}

function getBestSellingBooksReleasedIn2024(){
    return new Promise((resolve, reject) => con.query(`SELECT * FROM libros_mas_vendidos_2024 LIMIT 30`, (error, result) => {
        if(error) reject(error)
        resolve(result)
    }))
}

function getByCategory(category){
    return new Promise((resolve, reject) => con.query(`SELECT lb.* FROM libro lb JOIN categoria_libro cl ON (lb.id=cl.libro_id) JOIN categoria cat ON (cat.id=cl.categoria_id) where cat.nombre=?`, category, (error, result) => {
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

module.exports = { getAll, findByText, getBestSellingBooks, getBestSellingBooksReleasedIn2024, getByCategory, get, add, update, destroy }