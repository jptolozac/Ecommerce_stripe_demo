import axios from "axios";

// eslint-disable-next-line no-undef
const LOGIN_ENDPOINT = import.meta.env.VITE_BACKEND_URL

export async function login({ username, password }){
    const form = {
        correo: username,
        password: password
    }
    try {
        const response = await axios.post(`${LOGIN_ENDPOINT}/login`, form, { 
            headers: { "Content-Type": "application/x-www-form-urlencoded" } 
        })
        const data = await response.data
        console.log(data.body.error);
        return data.body.token
    } catch (error) {
        return null
    }
}