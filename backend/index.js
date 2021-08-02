const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()

const { api, apiRoutes } = require('./controllers/api')
const { PORT, API_ENDPOINT, FRONTEND_ENDPOINT, FRONTEND_BUILD_PATH } = require('./utils/config')

app.use(cors())
app.use(express.json())
app.use(API_ENDPOINT, api)

app.get('/', (req, res) => {
    res.send('welcome to text statistics tool')
})

app.get('/routes', (req, res) => {
    res.json(apiRoutes)
})

FRONTEND_BUILD_PATH && FRONTEND_ENDPOINT && app.use(express.static(path.join(__dirname, FRONTEND_BUILD_PATH)))
FRONTEND_BUILD_PATH && FRONTEND_ENDPOINT && app.get(FRONTEND_ENDPOINT, (req, res) => {
    res.sendFile(path.join(__dirname, `${FRONTEND_BUILD_PATH}/index.html`))
})

const server = app.listen(PORT, function () {
//https://stackoverflow.com/questions/32590756/expressjs-server-address-host-returns-nothing
    var port = this.address().port;
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('listening at http://%s:%s', add, port)
    })
})

process.on('SIGINT', () => {
    console.log("Caught interrupt signal")
    server.close()
})

process.on('uncaughtException', (err, origin) =>{
    console.error(`Caught exception: ${err}\nException origin: ${origin}`)
})

module.exports = server