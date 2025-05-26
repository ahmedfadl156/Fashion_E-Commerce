import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (userJson && token) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
      this.userRoleSubject.next(role || '');
    }
  }

  signup(userData: SignupData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }

  login(loginData: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }

  private handleAuthentication(response: AuthResponse): void {
    const { token, user } = response;
    
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userRole', user.role);
    
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
    this.userRoleSubject.next(user.role);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next('');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  Admin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string {
    return this.userRoleSubject.value;
  }

  setLoginStatus(status: boolean, role: string = '') {
    this.isLoggedInSubject.next(status);
    this.userRoleSubject.next(role);
    if (status) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  }
}