require('dotenv').config()
const PORT = process.env.PORT || 3001
const API_ENDPOINT = process.env.API_ENDPOINT || '/api'
const FRONTEND_ENDPOINT = process.env.FRONTEND_ENDPOINT || undefined
const FRONTEND_BUILD_PATH = process.env.FRONTEND_BUILD_PATH || undefined

const config = {
    PORT,
    API_ENDPOINT,
    FRONTEND_ENDPOINT,
    FRONTEND_BUILD_PATH
}

module.exports = config