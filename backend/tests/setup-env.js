// Runs before each test file, before any module is required.
// dotenv never overrides variables that already exist, so these win over backend/.env
process.env.JWT_SECRET = "test-jwt-secret"
process.env.STRIPE_SECRET = ""
process.env.HOST = "localhost"
process.env.PORT = "3000"
process.env.PROTOCOL = "http"
process.env.FRONTEND_URL = "http://localhost:5173"

// Controllers log a lot; keep test output readable
jest.spyOn(console, "log").mockImplementation(() => {})
