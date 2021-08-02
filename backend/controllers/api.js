const { letterFrequencies, wordFrequencies, textStats, charNgramFrequencies, wordNgrams } = require('../utils/textStats')
const { API_ENDPOINT } = require('../utils/config')
const api = require('express').Router()

api.post('/letterfreqs', (req, res) => {
    if(!Object.keys(req.body) || !req.body.text)
        return res.status(400)
    res.json(letterFrequencies(req.body.text))
})

api.post('/wordfreqs', (req, res) => {
    if(!Object.keys(req.body) || !req.body.text)
        return res.status(400)
    res.json(wordFrequencies(req.body.text))
})

api.post('/textstats', (req, res) => {
    if(!Object.keys(req.body) || !req.body.text)
        return res.status(400)
    res.json(textStats(req.body.text))
})

api.post('/charngramfreqs', (req, res) => {
    if(!Object.keys(req.body) || !req.body.text)
        return res.status(400)
    res.json(charNgramFrequencies(req.body.text, req.body.n, req.body.m))
})

api.post('/wordngramfreqs', (req, res) => {
    if(!Object.keys(req.body) || !req.body.text)
        return res.status(400)
    res.json(wordNgrams(req.body.text, req.body.n, req.body.m))
})

const apiRoutes = {
    letterFreqs: `${API_ENDPOINT}/letterfreqs`,
    wordFreqs: `${API_ENDPOINT}/wordfreqs`,
    textStats: `${API_ENDPOINT}/textstats`,
    charNgramFreqs: `${API_ENDPOINT}/charngramfreqs`,
    wordNgramFreqs: `${API_ENDPOINT}/wordngramfreqs`
}

module.exports = { api, apiRoutes }