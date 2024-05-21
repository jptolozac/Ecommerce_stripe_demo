const mysql = require("mysql")
const config = require("../config")

const dbconfig = {
    host: config.db.mysql.host,
    port: config.db.mysql.port,
    user: config.db.mysql.user,
    password: config.db.mysql.password,
    database: config.db.mysql.database
}

function mysqlCon(){
    let con
    con = mysql.createConnection(dbconfig)

    con.connect((err) => {
        if(err){
            console.log("Error en la base de datos: ", err);
            setTimeout(mysql, 500)
        }else{
            console.log("Conexión a mysql creada");
        }
    })

    con.on('error', err => {
        console.log("Error en la base de datos: ", err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            mysqlCon()
        }else{
            throw err
        }
    })
    return con
}

const con = mysqlCon()

module.exports = { mysqlCon, con }