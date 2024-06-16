require("dotenv").config()

module.exports = {
    app:{
        port: process.env.PORT || 3000,
        host: process.env.HOST || '127.0.0.1',
        domain: `${process.env.PORT ? process.env.HOST + ":" + process.env.PORT : process.env.HOST }`,
        protocol: process.env.PROTOCOL || 'http'
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
    },
    stripe: {
        secret: process.env.STRIPE_SECRET
    }
}