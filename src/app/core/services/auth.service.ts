import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserProfile,
  ApiError
} from '../models/auth.model';
import { SplashService } from './splash.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8000/api';
  private readonly TOKEN_KEY = 'novauto_token';
  private readonly USER_KEY = 'novauto_user';

  private _currentUser = signal<UserProfile | null>(this.loadUserFromStorage());
  private _isLoading = signal<boolean>(false);

  currentUser = this._currentUser.asReadonly();
  isLoading = this._isLoading.asReadonly();

  isLoggedIn = computed(() => this._currentUser() !== null);
  userRole = computed(() => this._currentUser()?.role ?? null);
  isAcheteur = computed(() => this._currentUser()?.role === 'ACHETEUR');
  isVendeur = computed(() => this._currentUser()?.role === 'VENDEUR');
  isAdmin = computed(() => this._currentUser()?.role === 'ADMINISTRATEUR');

  constructor(
    private http: HttpClient,
    private router: Router,
    private splashService: SplashService
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this._isLoading.set(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        this.storeToken(response.token);
        this.storeUser(response.user);
        this._currentUser.set(response.user);
        this._isLoading.set(false);

        // Afficher le splash screen avant la redirection
        this.splashService.show();
        setTimeout(() => {
          this.redirectAfterLogin(response.user);
        }, 3800); // Attendre la fin du splash (3s animation + 0.8s fade)
      }),
      catchError(error => {
        this._isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
  this._isLoading.set(true);
  return this.http.post<AuthResponse>(
    `${this.API_URL}/auth/register`,
    data,
    {
      observe: 'response',
      headers: { 'Accept': 'application/json' }
    }
  ).pipe(
    tap((response: any) => {
      const body = response.body;
      if (body?.token) {
        this.storeToken(body.token);
        this.storeUser(body.user);
        this._currentUser.set(body.user);
      }
      this._isLoading.set(false);
    }),
    map((response: any) => response.body),
    catchError(error => {
      this._isLoading.set(false);
      return throwError(() => error);
    })
  );
}



  logout(): void {
    this.clearSession();
    this.http.post(`${this.API_URL}/auth/logout`, {}).subscribe();
    window.location.href = '/auth/login';
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private redirectAfterLogin(user: UserProfile): void {
    switch (user.role) {
      case 'ADMINISTRATEUR':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'VENDEUR':
        this.router.navigate(['/vendeur/dashboard']);
        break;
      case 'ACHETEUR':
        this.router.navigate(['/acheteur/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private storeUser(user: UserProfile): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private loadUserFromStorage(): UserProfile | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as UserProfile;
    } catch {
      return null;
    }
  }

    private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }
}