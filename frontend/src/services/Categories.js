// eslint-disable-next-line no-undef
const CATEGORY_ENDPOINT = `${import.meta.env.VITE_BACKEND_URL}/categorias`;

export async function getCategories() {
    const response = await fetch(CATEGORY_ENDPOINT)
    const data = await response.json()
    if(data.error) return []
    const cartegoriesResults = data.body
    
    return cartegoriesResults.map(categorie => ({
        id: categorie.id,
        name: categorie.nombre
    }))
}