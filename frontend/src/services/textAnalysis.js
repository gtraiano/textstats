import axios from 'axios'
import config from '../utils/config'

const letterFrequenciesAnalysis = async text => {
    const response = await axios.post(config.routes.letterFreqs, { text })
    return response.data
}

const wordFrequenciesAnalysis = async text => {
    const response = await axios.post(config.routes.wordFreqs, { text })
    return response.data
}

const textStats = async text => {
    const response = await axios.post(config.routes.textStats, { text })
    return response.data
}

const charNgramFrequencies = async text => {
    const response = await axios.post(config.routes.charNgramFreqs, { text, n: 2, m: 3 })
    return response.data
}

const wordNgramFrequencies = async text => {
    const response = await axios.post(config.routes.wordNgramFreqs, { text, n: 2, m: 3 })
    return response.data
}

const welcome = async () => {
    return (await axios.get(config.backendUrl)).data
}

export const getRoutes = async () => {
    return Object.fromEntries(
        Object.entries(
            (await axios.get(`${config.backendUrl}/routes`)).data
        )
        .map(([key, value]) => [key, `${config.backendUrl}${value}`])
    )
}

const exports = {
    letterFrequenciesAnalysis,
    wordFrequenciesAnalysis,
    textStats,
    charNgramFrequencies,
    wordNgramFrequencies,
    welcome,
    getRoutes
}
export default exports