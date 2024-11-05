import csurf from "csurf";

export const csrfProtection = csurf({
    cookie: true // Usar cookie para almacenar el token
})