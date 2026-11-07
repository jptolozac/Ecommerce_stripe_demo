const express = require("express")

// Mounts a single router on a bare Express app, without the morgan/cors setup from routes.js
function buildApp(path, router, ...middlewares) {
    const app = express()
    app.use(express.json())
    app.use(path, ...middlewares, router)
    return app
}

module.exports = buildApp
