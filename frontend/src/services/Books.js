import { shapeBooks, shapePrevewBooks } from '../helpers/shapeBooks'
import booksResults from '../mocks/books.json'

const BOOKS_ENPOINT = "http://localhost:3000/api/libros"

export async function getBestSellingBooks(){
    try {
        const response = await fetch(`${BOOKS_ENPOINT}/libros_mas_vendidos`)
        const data = await response.json()
        if(data.error) return []
        
        let booksResults = data.body
        booksResults = shapePrevewBooks(booksResults)
        return booksResults

    } catch (error) {
        return []
    }
}

export async function getBestNewBooks(){
    try {
        const response = await fetch(`${BOOKS_ENPOINT}/libros_mas_vendidos_2024`)
        const data = await response.json()
        if(data.error) return []
        
        let booksResults = data.body
        booksResults = shapePrevewBooks(booksResults)
        return booksResults

    } catch (error) {
        return []
    }
}

export async function getWantedBooks({ text }){
    try {
        const response = await fetch(`${BOOKS_ENPOINT}?q=${text}`)
        const data = await response.json()
        if(data.error) return []
    
        const books = data.body
        return shapePrevewBooks(books)
        
    } catch (error) {
        return []
    }
    // const books = getBestSellingBooks()
    // return books.filter(book => book.title.toLowerCase().includes(text))
}

export async function getBooksByCategory({ category }){ //obligatorio en el backend
    try {
        const response = await fetch(`${BOOKS_ENPOINT}/categorias/${category}`)
        const data = await response.json()
        if(data.error) return []
    
        const books = data.body
        return shapePrevewBooks(books)
        
    } catch (error) {
        return []
    }

    // const books = booksResults.filter(book => {
    //     const lowerBooks = book.categories.map(cat => cat.toLowerCase())
    //     return lowerBooks.includes(category.toLowerCase())
    // })
    // return shapePrevewBooks(books)
}

export async function getBook({ bookId }){
    try {
        const response = await fetch(`${BOOKS_ENPOINT}/${bookId}`)
        const data = await response.json()
        if(data.error) return []
    
        const books = data.body
        return shapeBooks(books)
        
    } catch (error) {
        return []
    }
    // const books = booksResults.find(book => book.id === bookId)
    // return shapeBooks(books)
}