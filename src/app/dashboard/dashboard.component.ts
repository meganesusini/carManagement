import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalCars = 0;
  closedCarsCount = 0;

  constructor(private authService: AuthService, private carService: CarService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getAuthenticatedUser();
    if (!this.currentUser) {
      console.log('No users logged in.');
    } else {
      console.log('User logged in :', this.currentUser);
    }

    this.carService.getCarsCount().subscribe((count) => {
      this.totalCars = count; 
      console.log(`Total number of projects : ${this.totalCars}`);
    });
  }
}