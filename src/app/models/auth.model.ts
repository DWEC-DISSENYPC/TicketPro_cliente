export interface AuthResponse {
    token: string;
    username: string;
    roles: string[];
}

export interface LoginCredentials {
    username: string;
    password: string;
}