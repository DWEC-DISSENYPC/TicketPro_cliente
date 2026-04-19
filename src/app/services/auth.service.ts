import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, Subject, BehaviorSubject, of, catchError } from 'rxjs';
import { LoginCredentials } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  updatePerfil(data: any): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.put('http://localhost:8080/api/clientes/update', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // 1. URL base unificada para evitar errores de conexión y CORS
  private apiUrl = 'http://localhost:8080/api';
  private authUrl = `${this.apiUrl}/auth`;
  private usuariosUrl = `${this.apiUrl}/clientes`;

  private loginSuccessSource = new Subject<string>();
  loginSuccess$ = this.loginSuccessSource.asObservable();

  // ------ Fuente De Verdad Sobre El Estado De Autenticacion ------
  private loggedInSource = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInSource.asObservable();

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
          this.loggedInSource.next(true); // ------ Notificamos El Cambio De Estado ------
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
  
  // ------ Comprobacion Rapida Sincrona Sobre El Estado Actual ------
  isLoggedIn(): boolean {
    return this.loggedInSource.value;
  }

  // ------ Validacion Simple Del Token En Almacenamiento ------
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // ------ Validacion Profunda Del Token Contra El Servidor ------
  checkSession(): void {
    if (!this.hasToken()) {
      this.loggedInSource.next(false);
      return;
    }

    this.getPerfil().pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          this.logout(); // ------ Si El Servidor Dice Que No Es Valido Limpiamos ------
        }
        return of(null);
      })
    ).subscribe((perfil) => {
      if (perfil) {
        this.loggedInSource.next(true);
      }
    });
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.loggedInSource.next(false); // ------ Notificamos El Cierre De Sesion ------
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
    passwordNueva: string,
    passwordActual: string = '',
  ): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.patch(
      `${this.usuariosUrl}/password`,
      { passwordActual, passwordNueva },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
         responseType: 'text' as 'json'
      },
    );
  }

  subirImagenPerfil(formData: FormData) {
    const token = localStorage.getItem('token');
    console.log('Token al subir imagen:', token); // ¿Es null? ¿Está expirado?

    return this.http.post<any>(
      'http://localhost:8080/api/clientes/imagen',
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
  }
}
