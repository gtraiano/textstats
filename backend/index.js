require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001

const { letterFrequencies, wordFrequencies, textStats, charNgramFrequencies, wordNgrams } = require('./utils/textStats')

app.use(cors())
app.use(express.json())

//app.use('/', express.static('public/build'))
//app.use('/app', express.static(path.join(__dirname, 'public/build')))

app.get('/', (req, res) => {
    res.send('welcome to text analysis tool')
})

app.get('/routes', (req, res) => {
    res.json({
        letterFreqs: '/letterfreqs',
        wordFreqs: '/wordfreqs',
        textStats: '/textstats',
        charNgramFreqs: '/charngramfreqs',
        wordNgramFreqs: '/wordngramfreqs'
    })
})

app.post('/letterfreqs', (req, res) => {
    if(!Object.keys(req.body) || !req.body.text)
        return res.status(400)
    res.json(letterFrequencies(req.body.text))
    //res.send('ok').status(200)
})

app.post('/wordfreqs', (req, res) => {
    if(!Object.keys(req.body) || !req.body.text)
        return res.status(400)
    res.json(wordFrequencies(req.body.text))
})

app.post('/textstats', (req, res) => {
    if(!Object.keys(req.body) || !req.body.text)
        return res.status(400)
    res.json(textStats(req.body.text))
})

app.post('/charngramfreqs', (req, res) => {
    if(!Object.keys(req.body) || !req.body.text)
        return res.status(400)
    res.json(charNgramFrequencies(req.body.text, req.body.n, req.body.m))
})

app.post('/wordngramfreqs', (req, res) => {
    if(!Object.keys(req.body) || !req.body.text)
        return res.status(400)
    res.json(wordNgrams(req.body.text, req.body.n, req.body.m))
})

app.use(express.static(path.join(__dirname, 'public/build')))
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/build/index.html'))
})

app.listen(PORT, function () {
//https://stackoverflow.com/questions/32590756/expressjs-server-address-host-returns-nothing
    var port = this.address().port;
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('listening at http://%s:%s', add, port)
    })
})