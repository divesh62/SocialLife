const { default: axios } = require("axios");

//  export const BASE_URL = "http://localhost:9000";
export const BASE_URL = "https://sociallife-fclc.onrender.com";

export const clientServer = axios.create({
    baseURL : BASE_URL,
})