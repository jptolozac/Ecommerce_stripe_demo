const app = require("./controllers/routes")
const { mysqlCon } = require("./repository/connection")
const { migrar } = require('./db/migrate')

migrar()
    .then(() => {
        mysqlCon()
        app.listen(app.get('port'), app.get('host'), () => {
            console.log(`Servidor iniciado en http://${app.get('host')}:${app.get("port")}`)
        })
    })
    .catch(err => {
        console.error("Falló la migración:", err)
        process.exit(1)
    })