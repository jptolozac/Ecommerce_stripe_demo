import { useContext, useId } from "react"
import shoppingCart from '../assets/shopping-cart.svg'
import '../styles/cartAside.css'
import closeWindow from '../assets/close.svg'
import { BookCard } from "./bookCard"
import { orderBook, removeBookFromFacture } from "../services/shoppingCart"
import { CartContext } from "../context/cart"
import { Button } from "@mui/joy"


export function CartAside() {
    const inputId = useId()
    const { state, dispatch } = useContext(CartContext)

    const removeBook = book => {
        removeBookFromFacture({ bookId: book.id }).then(() => {
            dispatch({
                type: 'REMOVE_FROM_CART',
                payload: book
            })
        })
    }

    const addBook = book => {
        orderBook({ bookId: book.id }).then(() => {
            dispatch({
                type: 'ADD_TO_CART',
                payload: book
            })
        })
    }

    //pasarela de pagos (Aún no implementada)
    const handleSendBooks = () => {
        console.log(state);
    }

    console.log(state)

    return (
        <div>
            <label htmlFor={inputId} className='card-button'>
                <img src={shoppingCart} alt="Shopping cart icon" />
                <span className='text-xl'>Carrito</span>
            </label>
            <input type="checkbox" id={inputId} />
            <aside className="cart">
                <div className="flex justify-end">
                    <label htmlFor={inputId}>
                        <img src={closeWindow} alt="Close window icon" className="bg-dark-red rounded-full w-8" />
                    </label>
                </div>
                {state.length > 0 && state.map(book => (
                    <div key={book.id} className="flex flex-col">
                        <BookCard key={book.id} book={book} >
                            <div className="flex justify-center my-4">
                                <span>
                                    Cantidad:
                                    <button
                                        className="bg-gray-300 px-2 mx-2 rounded-md"
                                        onClick={() => removeBook(book)}
                                    >-</button>
                                    {book && book.quantity}
                                    <button
                                        className="bg-gray-300 px-2 mx-2 rounded-md"
                                        onClick={() => addBook(book)}
                                    >+</button>
                                </span>
                            </div>
                        </BookCard>
                    </div>
                ))}
                <div className="flex justify-center">
                    {state && <Button sx={{
                        backgroundColor: '#BF1717',
                        marginY: '2rem',
                        paddingX: '2rem',
                        paddingY: '.7rem',
                        "&:hover": {
                            backgroundColor: '#bf1717c9'
                        },
                        fontSize: "1.1rem"
                    }}
                        type="submit"
                        onClick={handleSendBooks}
                    >PEDIR LIBROS</Button>}
                </div>
            </aside>
        </div>
    )
}