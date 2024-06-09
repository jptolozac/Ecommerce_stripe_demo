import { BookCard } from "./bookCard"
import { BookCardLoading } from "./bookCardLoading";

export function ShowBooksSearch({ books, loading }) {
    return (
        <div className="mx-auto max-w-screen-xl pb-8">
            {
                loading
                    ? (
                        <div className="flex flex-wrap">
                            <BookCardLoading />
                            <BookCardLoading />
                            <BookCardLoading />
                            <BookCardLoading />
                            <BookCardLoading />
                        </div>
                    )
                    : (
                        <section className="mt-8 flex flex-wrap border-t border-l -mx-[1px]">
                            {
                                books.map(book => (
                                    <BookCard key={book.id} book={book} />
                                ))
                            }
                        </section>
                    )
            }
        </div>
    )
}