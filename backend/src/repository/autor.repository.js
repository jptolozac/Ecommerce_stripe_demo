const { con } = require("./connection")

const table = "autor"

function getAll(){
    return new Promise((resolve, reject) => con.query(`SELECT * FROM ${table} LIMIT 30`, (error, result) => {
        if(error) reject(error)
        // console.log("result: ", result)
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

module.exports = { getAll, get, add, update, destroy }