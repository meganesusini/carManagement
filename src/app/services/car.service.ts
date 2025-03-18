import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Car } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private baseUrl = 'http://localhost:3001/cars'; // json-server --watch cars.json --port 3001
  
  constructor(private http: HttpClient) {}

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.baseUrl);
  }

  getCarsCount(): Observable<number> {
    return this.http.get<Car[]>(this.baseUrl).pipe(
      map((cars) => cars.length) 
    );
  }  
  
  addCar(car: Omit<Car, 'id'>): Observable<Car> {
    return this.getCars().pipe(
      map((cars) => {
        const maxId = cars.length > 0 ? Math.max(...cars.map((u) => Number(u.id))) : 0;
        const newCar: Car = { id: (maxId + 1).toString(), ...car }; 
        return newCar;
      }),
      tap((newCar) => {
        this.http.post<Car>(this.baseUrl, newCar).subscribe();
      })
    );
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`); 
  }

  updateCar(car: Car): Observable<Car> {
    return this.http.put<Car>(`${this.baseUrl}/${car.id}`, car);
  }
}
