import bookLogo from '/book.svg'
import magnifyingGlass from '../assets/magnifying-glass.svg'
import userImg from '../assets/user.svg'
import { Categories } from './categories'
import { ShowBooksSearch } from './showBooksSearch'
import { useSearchBooks } from '../hooks/searchBooks'
import { Link } from 'react-router-dom'
import { deleteCookie, getCookie } from '../helpers/cookies'
import { useEffect, useState } from 'react'
import { CartAside } from './cartAside'

export function Header({ hideContent }) {
    
    const { search, books, loading, textSearch, handleSubmit } = useSearchBooks({ hideContent })
    const isSearch = search !== ''
    const [loggedIn, setLoggedIn] = useState(false)

    const handleLogOut = () => {
        deleteCookie('token')
        setLoggedIn(false)
    }

    useEffect(() => {
        if(getCookie('token')) setLoggedIn(true)
    }, [])
    
    return (
        <>
            <div className="h-[30px] bg-dark-red" />
            <div className={`sticky top-0 z-10 ${isSearch ? 'min-h-screen bg-white' : ''}`}>
                <header className="bg-white border-b-2 border-black">
                    <div className="max-w-screen-xl mx-auto mb-3 flex justify-between flex-wrap">
                        <a href='' className='flex items-center'>
                            <img src={bookLogo} alt="Imagen de un libro en representación de la tienda" />
                            <h2 className='text-2xl'>Tienda de libros</h2>
                        </a>
                        <div className="h-full flex items-center"> {/* w-[700px] */}
                            <form onSubmit={handleSubmit} className='border-2 border-slate-400 m-2 flex flex-wrap'>
                                <input type="text" onChange={textSearch} size={60} className='px-2 py-1' />
                                <button>
                                    <img src={magnifyingGlass} alt="Imagen de una lupa en referencia a la búsqueda del libro" />
                                </button>
                            </form>
                        </div>
                        <div className="w-[175px] flex justify-between items-center">
                            <CartAside />
                            <Link to={loggedIn ? "/" : "/login"} className='relative first:text-red-600' id="sign-in-icon">
                                <img src={userImg} alt="Icono de usuario para iniciar sesión o registrarse" />
                                {loggedIn && <div className="w-[150px] h-[75px] bg-white absolute right-0 top-12 border rounded-lg justify-center items-center hidden" id="log-out-button">
                                    <button type='button' className='bg-dark-red px-4 py-2 text-white rounded-lg' onClick={handleLogOut}>Cerrar sesion</button>
                                </div>}
                            </Link>
                        </div>
                    </div>
                    <Categories/>
                </header>
                {
                    isSearch
                        ? <ShowBooksSearch books={books} loading={loading} />
                        : null
                }
            </div>
        </>

    )
} 