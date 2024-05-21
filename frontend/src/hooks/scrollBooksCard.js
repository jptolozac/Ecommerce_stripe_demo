import { useEffect, useRef } from "react";
import { useState } from "react"

export function useScrollBooksCard({ booksLength }) {
    const ITEM_WITH = 1280;
    const scrollNode = useRef()
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (scrollNode.current) {
            scrollNode.current.scrollTo({
                top: 0,
                left: ((currentIndex) * ITEM_WITH),
                behavior: "smooth"
            });
        }
    }, [currentIndex])

    const nextBookSet = () => {
        setCurrentIndex(value => {
            if (((value + 1) * 5) < booksLength) {
                return ++value
            }
            return value
        })
    }
    const prevBookSet = () => {
        const index = currentIndex < 1 ? currentIndex : currentIndex - 1
        setCurrentIndex(index)
    }
    const updateIndex = (index) => {
        setCurrentIndex(index)
    }

    return { nextBookSet, prevBookSet, updateIndex, scrollNode, currentIndex }
}