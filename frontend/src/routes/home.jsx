import { MainCard } from "../components/mainCard";
import { MainLayout } from "../layouts/mainLayout";
import feriaDelLibroImg from "../assets/feria_del_libro.webp"
import { ShowBooksCard } from "../components/showBooksCard";
import { getBestNewBooks, getBestSellingBooks } from "../services/Books";
import { useEffect, useState } from "react";
import { Toast } from "../components/toast";

export function Home() {
  const [bestSellingBooks, setBestSellingBooks] = useState()
  const [bestNewBooks, setBestNewBooks] = useState()

  useEffect(() => {
    getBestSellingBooks().then(data => setBestSellingBooks(data))
    getBestNewBooks().then(data => setBestNewBooks(data))
  }, [])


  return (
    <MainLayout>
      <MainCard
        img={{ src: feriaDelLibroImg, alt: "Imagen promotora de la feria del libro Colombia 2024" }}
        text={"¡Vive la feria del libro con los mejores libros!"}
        anchor={{ href: "https://feriadellibro.com/", text: "Feria del libro" }}
      />
      {
        bestSellingBooks
          ? <ShowBooksCard
            title={"Lo más vendido"}
            books={bestSellingBooks}
          />
          : null
      }
      {
        bestNewBooks
          ? <ShowBooksCard
            title={"Novedades 2024"}
            books={bestNewBooks}
          />
          : null
      }

      <Toast />
    </MainLayout>
  );
}