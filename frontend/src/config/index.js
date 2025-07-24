const{default:axios}  = require("axios");

export const BASE_URL = "https://proconnect-d1no.onrender.com"

export const clientServer = axios.create({
    baseURL: BASE_URL,
})