import { useEffect, useMemo, useState } from 'react'
import debounce from 'just-debounce-it'
import { getBooksByCategory, getWantedBooks } from '../services/Books'


export function useSearchBooks() {
    const [search, setSearch] = useState('')
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)

    //fix error eslint cambiando el useCallback por un useMemo
    const debounceSearch = useMemo(() => debounce((text) => {
        getWantedBooks({ text }).then(data => setBooks(data))
        setLoading(false)
    }, 500), [])

    const textSearch = (event) => {
        const currentSearch = event.target.value

        if(currentSearch === "" || currentSearch.length < 2){
            setSearch("")
            return
        }
        setLoading(true)
        debounceSearch(currentSearch)
        setSearch(currentSearch)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        setTimeout(() => {
            debounceSearch(search)
            setLoading(false)
        }, 500)
    }

    const searchByCategory = (category) => {
        setLoading(true)
        getBooksByCategory({ category }).then(data => {
            setBooks(data)
            setLoading(false)
        })

        setSearch(String(category))
    }

    useEffect(() => {
        // if(hideContent)
        //     search !== '' ? hideContent(true) : hideContent(false)
    }, [search])

    return { search, books, loading, textSearch, handleSubmit, searchByCategory }
}