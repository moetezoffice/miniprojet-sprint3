import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { User } from '../models/user.model';

interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  username: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:8090/produits/auth/login';
  private readonly tokenStorageKey = 'mesPlantes.accessToken';

  accessToken: string | null = null;
  loggedUser: string | null = null;
  isloggedIn = false;
  roles: string[] = [];

  constructor() {
    this.restoreSession();
  }

  signIn(user: Pick<User, 'username' | 'password'>): Observable<void> {
    return this.http.post<LoginResponse>(this.apiUrl, user).pipe(
      tap((response) => this.storeSession(response)),
      map(() => undefined),
    );
  }

  logout(): void {
    this.clearSession();
    void this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.roles.includes('ADMIN');
  }

  restoreSession(): void {
    const token = localStorage.getItem(this.tokenStorageKey);
    if (!token) {
      localStorage.removeItem('loggedUser');
      localStorage.removeItem('isloggedIn');
      return;
    }

    try {
      const segment = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(segment + '='.repeat((4 - segment.length % 4) % 4))) as {
        sub?: string;
        exp?: number;
        roles?: string[];
      };
      if (!payload.sub || !payload.exp || payload.exp * 1000 <= Date.now()) {
        this.clearSession();
        return;
      }
      this.accessToken = token;
      this.loggedUser = payload.sub;
      this.roles = Array.isArray(payload.roles) ? payload.roles : [];
      this.isloggedIn = true;
    } catch {
      this.clearSession();
    }
  }

  private storeSession(response: LoginResponse): void {
    this.accessToken = response.accessToken;
    this.loggedUser = response.username;
    this.roles = [...response.roles];
    this.isloggedIn = true;
    localStorage.setItem(this.tokenStorageKey, response.accessToken);
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('isloggedIn');
  }

  private clearSession(): void {
    this.accessToken = null;
    this.loggedUser = null;
    this.roles = [];
    this.isloggedIn = false;
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('isloggedIn');
  }
}
