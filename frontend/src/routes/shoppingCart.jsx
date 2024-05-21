import { useEffect, useState } from "react";
import { MainLayout } from "../layouts/mainLayout";
import { getBooks } from "../services/shoppingCart";
import { BookCard } from "../components/bookCard";
import { Button } from "@mui/joy";

export function ShoppingCart() {
    const [books, setBooks] = useState()
    useEffect(() => {
        getBooks().then(setBooks)
    }, [])

    const handleSendBooks = () => {
        console.log(books);
    }

    return (
        <MainLayout>
            <div className="flex border-l border-t w-fit flex-wrap -mx-[1px]">
                {books && books.length > 0
                    ? books.map((book, index) => (
                        <BookCard key={index} book={book} />
                    ))
                    : <h3 className="text-2xl font-semibold">No hay libros para pedir</h3>
                }
            </div>
            <div className="flex justify-center">
                <Button sx={{
                    backgroundColor: '#BF1717',
                    marginTop: '5rem',
                    paddingX: '2rem',
                    paddingY: '.7rem',
                    "&:hover": {
                        backgroundColor: '#bf1717c9'
                    },
                    fontSize: "1.1rem"
                }}
                    type="submit"
                    onClick={handleSendBooks}
                >PEDIR LIBROS</Button>
            </div>
        </MainLayout>
    )
}