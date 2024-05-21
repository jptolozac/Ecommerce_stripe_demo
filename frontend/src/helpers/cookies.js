export function getCookie(nombre){
    return document.cookie.split(";")
        .map(cookie => cookie.trim())
        .filter(cookie => cookie.split("=")[0] === nombre)
        .map(cookie => cookie.split("=")[1])[0]
}

export function setCookie(nombre, valor){
    document.cookie = `${nombre}=${valor}`
}

export function deleteCookie(nombre){
    /* document.cookie.split(";")
        .map(cookie => cookie.trim())
        .filter(cookie => cookie.split("=")[0] === nombre) */
    setCookie(nombre, `""; max-age=0`)
}