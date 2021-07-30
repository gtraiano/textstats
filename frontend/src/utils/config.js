import axios from 'axios'
const backendUrl = process.env.REACT_APP_BACKEND_URL

let config = {
    backendUrl
}

export const addConfigParam = (key, value) => {
    config[key] = value
}

export const getRoutes = async () => {
    return (await axios.get(`${backendUrl}/routes`)).data
}

export default config