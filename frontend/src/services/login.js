import axios from "axios";

const LOGIN_ENDPOINT = "http://localhost:3000/api"

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