export function MainCard({ img, text, anchor }){
    return (
        <section className="relative mx-auto mt-12">
            <img src={img.src} alt={img.alt} className="w-full"/>
            <div className="bg-black absolute bottom-0 w-full h-1/5 flex items-center justify-center gap-16 text-white">
                <p className="text-4xl">{text}</p>
                <a href={anchor.href} target="_blank" className="bg-custom-green text-center text-xl px-8 py-3 rounded-lg ml-10">{anchor.text}</a>
            </div>
        </section>
    )
}