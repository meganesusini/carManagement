import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/users'; // json-server --watch users.json --port 3000
  private authenticatedUser: User | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      map((users) =>
        users.find((user) => user.login === username && user.pwd === password)
      ),
      tap((user) => {
        if (user) {
          this.authenticatedUser = user; 
          localStorage.setItem('authenticatedUser', JSON.stringify(user));
          console.log('Authenticated User :', user);
        }
      }),
      map((user) => !!user), 
      catchError((error) => {
        console.error('Error during authentication :', error);
        return of(false); 
      })
    );
  }

  getAuthenticatedUser(): User | null {
    if (!this.authenticatedUser) {
      const storedUser = localStorage.getItem('authenticatedUser');
      this.authenticatedUser = storedUser ? JSON.parse(storedUser) : null;
    }
    return this.authenticatedUser;
  }

  logout(): void {
    this.authenticatedUser = null;
    localStorage.removeItem('authenticatedUser');
    console.log('Logout successful.');
  }
}
