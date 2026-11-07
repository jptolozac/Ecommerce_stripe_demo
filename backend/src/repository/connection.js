const mysql = require("mysql2")
const config = require("../config")

const dbconfig = {
    host: config.db.mysql.host,
    port: config.db.mysql.port,
    user: config.db.mysql.user,
    password: config.db.mysql.password,
    database: config.db.mysql.database
}

// The pool replaces dropped connections on its own, so repositories can keep using con.query
const con = mysql.createPool(dbconfig)

function mysqlCon(){
    con.getConnection((err, connection) => {
        if(err){
            console.log("Error en la base de datos: ", err.message);
            setTimeout(mysqlCon, 2000)
        }else{
            console.log("Conexión a mysql creada");
            connection.release()
        }
    })
}

module.exports = { mysqlCon, con }
