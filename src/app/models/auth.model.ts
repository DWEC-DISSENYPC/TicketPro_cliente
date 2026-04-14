/* ###### TIPOS Y OBJETOS ALUSIVOS AL CONTROL DE SESION ###### */

/* ------ Respuesta Generada Tras Post Que Alimenta Al Objeto Context Y Al Storage Local ------ */
export interface AuthResponse {
    token: string;
    username: string;
    roles: string[];
}

/* ------ Credenciales Recolectadas De Formulario Login Para Ingreso Validado ------ */
export interface LoginCredentials {
    username: string;
    password: string;
}