import axios from "axios";
import { getCookie } from "../helpers/cookies";
import { shapeBooks } from "../helpers/shapeBooks";

// eslint-disable-next-line no-undef
const ENDPOINT_LIBROS_FACTURAS = `${import.meta.env.VITE_BACKEND_URL}/facturas`

export async function getBooks() {
    const token = getCookie("token");
    console.log(ENDPOINT_LIBROS_FACTURAS);
    if (!token)
        return null
    try {
        const response = await axios.get(ENDPOINT_LIBROS_FACTURAS, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.data.body;
        // console.log(data);
        const books = await Promise.all(data.map(async book => await shapeBooks(book)))
        // console.log(await books);
        return books

    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function orderBook({ bookId }) {
    const token = getCookie("token");
    if (!token) return null

    try {
        const response = await axios.post(`${ENDPOINT_LIBROS_FACTURAS}/book/${bookId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.data
        console.log(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function removeBookFromFacture({ bookId }) {
    const token = getCookie("token")
    if (!token) return null

    try {
        const response = await axios.delete(`${ENDPOINT_LIBROS_FACTURAS}/book/${bookId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.data
        console.log(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function proceedToPayment() {
    try {
        const response = await axios.post(`${ENDPOINT_LIBROS_FACTURAS/* ETC... */}`, {})
        const data = await response.data()
        console.log(data);
    } catch (error) {
        console.log(error);
        return null
    }
}