import axios from "axios";
import { getCookie } from "../helpers/cookies";
import { shapeBooks } from "../helpers/shapeBooks";

const ENDPOINT_LIBROS_FACTURAS = "http://localhost:3000/api/facturas"

export async function getBooks() {
    const token = getCookie("token");
    // console.log(token);
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
        const books = Promise.all(data.map(async book => await shapeBooks(book)))
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