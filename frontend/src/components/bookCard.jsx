import { Link } from "react-router-dom";
import { CoinFormatter } from "../helpers/coinFormatter";

export function BookCard({ book }) {
    return (
        <Link to={`/books/${book.id}`} className="min-w-[256px] border-r border-b book-item">
            <img
                src={book.img}
                alt={`Imagen del libro ${book.title}`}
                width={207}
                height={251}
                className="mx-auto my-4 h-[251px] rounded-xl shadow-xl object-cover"
            />
            <div className="w-[226px] mx-auto text-lg">
                <p className="border-b px-2 font-semibold">{book.title}</p>
                <p className="px-2">{book.author}</p>
                <p className="mx-2 mt-6 mb-2 text-xl font-semibold text-dark-red">{CoinFormatter(book.price)}</p>
            </div>
        </Link>
    )
}