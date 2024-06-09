import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { Home } from './routes/home.jsx'
import { Product } from './routes/product.jsx'
import { BooksCategory } from './routes/booksCategory.jsx'
import { Login } from './routes/login.jsx'
import { ShoppingCart } from './routes/shoppingCart.jsx'
import { CartProvider } from './context/cart.jsx'

const router = createHashRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/books/:bookId',
    element: <Product />
  },
  {
    path: '/books/category/:category',
    element: <BooksCategory />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/shoppingcart',
    element: <ShoppingCart />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
)

/* ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />,
  </React.StrictMode>
) */
