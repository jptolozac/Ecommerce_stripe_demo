import { useState } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

export function MainLayout({ children }) {
    const [hidden, setHidden] = useState(false)

    const handleHidden = (isHidden) => setHidden(isHidden)

    return (
        <>
            <div className="min-h-screen">
                <Header hideContent={handleHidden} />
                <main className={`max-w-screen-xl h-full mx-auto mt-8 pb-8 ${hidden ? "hidden" : ""}`}>
                    {children}
                </main>
            </div>
            <Footer />
        </>
    )
}