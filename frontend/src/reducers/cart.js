import { getBooks } from "../services/shoppingCart"

export const cartInitialState = await getBooks() || []

export const cartReducer = (state, action) => {
    switch (action.type) {
        case 'PLUS': {
            return state + 1
        }
        case 'ADD_TO_CART': {
            const { id } = action.payload
            if(state.find(item => item.id === id)){
                const books = state.map(item => {
                    if (item.id === id) {
                        return {
                            ...item,
                            quantity: item.quantity + 1
                        }
                    }
                    return item
                })
                return books
            }
            
            return [
                ...state, 
                { 
                    ...action.payload,
                    quantity: 1
                }
            ];
        }
        case 'REMOVE_FROM_CART': {
            const { id } = action.payload
            const books = state.map(item => {
                if (item.id === id) {
                    if (item["quantity"] <= 1) return null
                    return {
                        ...item,
                        quantity: item.quantity - 1
                    }
                }
                return item
            })
            console.log(books);
            return books.filter(book => book !== null);
        }
    }
}