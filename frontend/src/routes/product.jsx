import { useParams } from "react-router-dom"
import { MainLayout } from "../layouts/mainLayout"
import { getBook } from "../services/Books"
import { CoinFormatter } from "../helpers/coinFormatter"
import { useEffect, useState, useContext } from "react"
import { getCookie } from "../helpers/cookies"
import { orderBook } from "../services/shoppingCart"
import { CartContext } from "../context/cart"

export function Product() {
    window.scroll(0, 0)

    const { state, dispatch } = useContext(CartContext)

    const { bookId } = useParams()
    const [book, setBook] = useState()
    const [loading, setLoading] = useState(true)
    const userLogged = getCookie("token")

    useEffect(() => {
        setLoading(true)
        getBook({ bookId: parseInt(bookId) }).then(data => {
            setBook(data)
            setLoading(false)
        })
    }, [bookId])

    console.log(state)

    const handleOrderBook = async () => {
        await orderBook({ bookId })
        dispatch({
            type: 'ADD_TO_CART',
            payload: book
        })
        alert("Libro añadido al carrito")
    }
    // TODO: Agregar un servicio carrito para agregar un libro

    return (
        <MainLayout>
            {
                !loading
                    ? <section className="flex flex-wrap pt-12">
                        <div className="w-[600px] h-[600px] flex justify-center items-center ">
                            <img
                                src={book.img}
                                alt={`Portada del libro ${book.title}`}
                                width={370}
                                height={450}
                                className="rounded-2xl h-[450px] object-contain drop-shadow-[4px_6px_10px_gray]"
                            />
                        </div>
                        <div className="w-[680px] h-[600px] border-l-2 border-black flex items-center">
                            <div className="mx-16">
                                <div className="text-3xl drop-shadow-[1px_1px_2px_gray]">{book.title}</div>
                                <div className="text-2xl text-dark-red mt-2 italic">{book.author}</div>
                                <ul className="flex mt-3">
                                    {
                                        book.categories.map((cat, index) => (
                                            <li key={index} className="bg-dark-red text-white px-2 py-1 rounded-md text-sm mr-4 flex items-center">
                                                {cat}
                                            </li>
                                        ))
                                    }
                                </ul>
                                <p className="mt-8 text-lg font-semibold drop-shadow-[1px_1px_0.5px_gray]">
                                    Sinopsis de {book.title}
                                </p>
                                <p className="h-[160px] overflow-auto">{book.synopsis}</p>
                                <p className="my-8 text-3xl">{CoinFormatter(book.price)}</p>
                                {userLogged &&
                                    <div className="">
                                        {
                                            book.disponibility > 0
                                                ? <button
                                                    className="bg-dark-red px-6 py-4 text-xl text-white rounded-md"
                                                    type="button"
                                                    onClick={handleOrderBook}
                                                >
                                                    Añadir al carrito
                                                </button>
                                                : <button className="px-6 py-4 text-xl cursor-default">
                                                    Sin disponibilidad
                                                </button>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </section>
                    : <span>cargando...</span>
            }

        </MainLayout>
    )
}