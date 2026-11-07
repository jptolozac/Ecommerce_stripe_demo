/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    // Fixed env vars (JWT secret, no Stripe key) before any module reads config.js
    setupFiles: ["<rootDir>/tests/setup-env.js"],
    clearMocks: true,
    collectCoverageFrom: ["src/**/*.js", "!src/index.js", "!src/mocks/**"],
}
