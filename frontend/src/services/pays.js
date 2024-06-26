import axios from "axios"
import { getCookie } from "../helpers/cookies"

// eslint-disable-next-line no-undef
const ENDPOINT_LIBROS_PAGOS = `${import.meta.env.VITE_BACKEND_URL}/pagos`


export async function proceedToPayment(){
    const token = getCookie("token")
    if(!token) return null

    try {
        const response = await axios.post(`${ENDPOINT_LIBROS_PAGOS}/proceedToPayment`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await response.data
        if(data.error) throw new Error("Error al procesar el pago")

        return data.body
    } catch (error) {
        console.log(error);
        return null;
    }
}