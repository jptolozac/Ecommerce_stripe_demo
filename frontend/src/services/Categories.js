import cartegoriesResults from '../mocks/categories.json'

const CATEGORY_ENDPOINT = "http://localhost:3000/api/categorias";

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