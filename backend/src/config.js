require("dotenv").config()

module.exports = {
    app:{
        port: process.env.PORT || 3000
    },
    db:{
        mysql:{
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB
        }
    },
    jwt: {
        secret: process.env.JWT_SECRET
    }
}