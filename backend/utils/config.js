require('dotenv').config()
const PORT = process.env.PORT || 3001
const API_ENDPOINT = process.env.API_ENDPOINT || '/'
const FRONTEND_ENDPOINT = process.env.FRONTEND_ENDPOINT || '/app'
const FRONTEND_BUILD_PATH = process.env.FRONTEND_BUILD_PATH || 'public/build'

const config = {
    PORT,
    API_ENDPOINT,
    FRONTEND_ENDPOINT,
    FRONTEND_BUILD_PATH
}

module.exports = config