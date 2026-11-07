import { useParams } from "react-router-dom"
import { MainLayout } from "../layouts/mainLayout"
import { useEffect } from "react"
import { useSearchBooks } from "../hooks/searchBooks"
import { ShowBooksSearch } from "../components/showBooksSearch"

export function BooksCategory(){
    const { category } = useParams()
    const { loading, books, searchByCategory } = useSearchBooks()

    useEffect(() => {
        searchByCategory(category)
    }, [category, searchByCategory])

    return (
        <MainLayout>
            <ShowBooksSearch books={books} loading={loading}/>
        </MainLayout>
    )
}