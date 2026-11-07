import { useEffect, useReducer } from "react";
import { cartInitialState, cartReducer } from "../reducers/cart";
import { getBooks } from "../services/shoppingCart";
import { CartContext } from "./cartContext";


export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, cartInitialState)

    useEffect(() => {
        getBooks().then(books => {
            if (books) dispatch({ type: 'SET_CART', payload: books })
        })
    }, [])

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    )
}
