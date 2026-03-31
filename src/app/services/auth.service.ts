import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, Subject } from 'rxjs';
import { LoginCredentials } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 1. URL base unificada para evitar errores de conexión y CORS
  private apiUrl = 'http://localhost:8080/api';
  private authUrl = `${this.apiUrl}/auth`;
  private usuariosUrl = `${this.apiUrl}/clientes`;

  private loginSuccessSource = new Subject<string>();
  loginSuccess$ = this.loginSuccessSource.asObservable();

  constructor(private http: HttpClient) {}

  // --- REGISTRO ---
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/register`, userData);
  }

  // --- LOGIN ---
  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', credentials.username);
        }
      }),
    );
  }

  // --- PERFIL ---
  getPerfil(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get<any>(`${this.usuariosUrl}/perfil`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // --- GESTIÓN DE SESIÓN ---
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  notifyLoginSuccess(username: string) {
    this.loginSuccessSource.next(username);
  }

  // --- RECUPERACIÓN DE CONTRASEÑA ---
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.authUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.authUrl}/reset-password`, {
      token,
      password,
    });
  }

  updatePassword(
    passwordActual: string,
    passwordNueva: string,
  ): Observable<any> {
    return this.http.put(`${this.usuariosUrl}/cambiar-password`, {
      passwordActual,
      passwordNueva,
    });
  }
}
