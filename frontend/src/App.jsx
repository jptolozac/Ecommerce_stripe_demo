import "./App.css";
import { MainCard } from "./components/mainCard";
import { MainLayout } from "./layouts/mainLayout";
import feriaDelLibroImg from "./assets/feria_del_libro.webp"
import { ShowBooksCard } from "./components/showBooksCard";
import { getBestNewBooks, getBestSellingBooks } from "./services/Books";
import { BookCardLoading } from "./components/bookCardLoading";

function App() {

  return (
    <MainLayout>
      <MainCard
        img={{ src: feriaDelLibroImg, alt: "Imagen promotora de la feria del libro Colombia 2024" }}
        text={"¡Vive la feria del libro con los mejores libros!"}
        anchor={{ href: "https://feriadellibro.com/", text: "Feria del libro" }}
      />
      <ShowBooksCard
        title={"Lo más vendido"}
        books={getBestSellingBooks()}
      />
      <ShowBooksCard
        title={"Novedades 2024"}
        books={getBestNewBooks()}
      />

    </MainLayout>
  );
}

export default App;
