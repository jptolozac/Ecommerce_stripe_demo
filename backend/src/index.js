const app = require("./controllers/routes")
const { mysqlCon } = require("./repository/connection")

mysqlCon()


app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado en http://localhost:${app.get("port")}`);
})