import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:3000/users'; // json-server --watch users.json --port 3000

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this.getUsers().pipe(
      map((users) => {
        const maxId = users.length > 0 ? Math.max(...users.map((u) => Number(u.id))) : 0;
        const newUser: User = { id: (maxId + 1).toString(), ...user };
        return newUser;
      }),
      tap((newUser) => {
        this.http.post<User>(this.baseUrl, newUser).subscribe();
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`); 
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${user.id}`, user);
  }
}
