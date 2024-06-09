import { useScrollBooksCard } from "../hooks/scrollBooksCard";
import { BookCard } from "./bookCard";

export function ShowBooksCard({ title, books }) {
    const { nextBookSet, prevBookSet, updateIndex, scrollNode, currentIndex } = useScrollBooksCard({ booksLength: books.length })

    const set = []
    const bookSetLength = books.length / 5
    for (let i = 0; i < bookSetLength; i++) {
        set.push(i)
    }


    return (
        books.length > 0
            ? <section className="my-12">
                <p className="text-2xl mb-2">{title}</p>
                <div ref={scrollNode} className="min-h-[452px] w-full border border-custom-gray flex overflow-hidden">
                    {
                        books.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))
                    }
                </div>
                <div className="mx-auto text-xl font-bold w-fit">
                    <button className="p-3" onClick={prevBookSet}>&#10092;</button>
                    {
                        set.map(index => (
                            index === currentIndex
                                ? <button key={index} className="bg-slate-200 p-1 rounded-full">⚫</button>
                                : <button key={index} onClick={() => updateIndex(index)} className="p-2 transition-opacity">⚫</button>
                        ))
                    }
                    <button className="p-3" onClick={nextBookSet}>&#10093;</button>
                </div>
            </section>
            : null
    )
}