import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  getallUsers(){
    return this.http.get<any>(`${this.apiUrl}/all`)
  }

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (userJson && token) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
    }
  }


  deleteUser(id: string){
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  register(user: {username: string, email: string, password: string}): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.handleAuthentication(response);
          }
        })
      );
  }

  add(user: {username: string , email: string , password: string , role: string}):Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/add` , user);
  }

  login(credentials: {email: string, password: string}): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.handleAuthentication(response);
          }
        })
      );
  }

  private handleAuthentication(response: AuthResponse): void {
    const { token, user } = response;
    
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
