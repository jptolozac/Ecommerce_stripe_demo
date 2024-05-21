import { Link } from "react-router-dom"
import { getCategories } from "../services/Categories"
import { useEffect, useState } from "react"

export function Categories() {
    const [categories, setCategories] = useState()
    console.log()
    
    useEffect(() => {
        getCategories().then(data => setCategories(data))
    }, [])

    return (
        categories
        ? <div className="mx-auto w-fit">
            <div className="flex my-1 max-w-screen-xl flex-wrap">
                {categories.map(category => (
                    <Link to={window.origin + `/books/category/${category.name}`} key={category.id} className="mx-3 text-lg hover:scale-110 transition">
                        {category.name}
                    </Link>
                ))}
            </div>
        </div>
        : null
    )
}