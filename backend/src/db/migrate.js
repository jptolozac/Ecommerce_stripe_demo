const fs = require("node:fs/promises")
const path = require("node:path")
const mysql = require("mysql2/promise")
const config = require("../config")

const DB_DIR = path.join(__dirname, "..", "..", "db")   // backend/db
const LOCK = "schema_migrations_lock"

async function conectarConReintentos(intentos = 30) {
  for (let i = 1; ; i++) {
    try {
      return await mysql.createConnection({
        host: config.db.mysql.host,
        port: Number(config.db.mysql.port) || 3306,
        user: config.db.mysql.user,
        password: config.db.mysql.password,
        database: config.db.mysql.database,
        multipleStatements: true,
      })
    } catch (err) {
      if (i >= intentos) throw err
      console.log(`MySQL no responde (${err.code}), reintento ${i}/${intentos}...`)
      await new Promise(r => setTimeout(r, 2000))
    }
  }
}

async function aplicarCarpeta(con, carpeta, prefijo) {
  const dir = path.join(DB_DIR, carpeta)
  const archivos = (await fs.readdir(dir)).filter(f => f.endsWith(".sql")).sort()
  const [filas] = await con.query("SELECT name FROM schema_migrations")
  const aplicadas = new Set(filas.map(f => f.name))
  for (const archivo of archivos) {
    const nombre = prefijo + archivo
    if (aplicadas.has(nombre)) continue
    console.log(`Aplicando ${nombre}`)
    await con.query(await fs.readFile(path.join(dir, archivo), "utf8"))
    await con.query("INSERT INTO schema_migrations (name) VALUES (?)", [nombre])
  }
}

async function migrar() {
  const con = await conectarConReintentos()
  try {
    const [[{ ok }]] = await con.query("SELECT GET_LOCK(?, 60) AS ok", [LOCK])
    if (ok !== 1) throw new Error("No se obtuvo el lock de migraciones")
    await con.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)
    await aplicarCarpeta(con, "migrations", "")
    if (process.env.SEED_DB === "true") await aplicarCarpeta(con, "seeds", "seed:")
  } finally {
    await con.query("SELECT RELEASE_LOCK(?)", [LOCK]).catch(() => {})
    await con.end()
  }
}

module.exports = { migrar }