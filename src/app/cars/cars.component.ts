import { Component, OnInit } from '@angular/core';
import { Car } from '../models/car.model';
import { CarService } from '../services/car.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-cars',
  standalone: false,
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css'
})
export class CarsComponent implements OnInit {

  cars: Car[] = [];
  
  newCar: Omit<Car, 'id'> = { brand: '', model: '', color: '' };

  carToDelete: Car = { id: '', brand: '', model: '', color: '' };

  selectedCar: Car = { id: '', brand: '', model: '', color: '' };

  confirmChanges = false; 

  currentUser: User | null = null;

  constructor(private carService: CarService, private authService: AuthService) {}
  
  ngOnInit(): void {
    this.carService.getCars().subscribe((cars) => {
      this.cars = cars;
    });
    this.currentUser = this.authService.getAuthenticatedUser();
  }

  addCar(): void {
    if (
      this.newCar.brand &&
      this.newCar.model &&
      this.newCar.color
    ) {
      this.carService.addCar(this.newCar).subscribe((newCar) => {
        this.cars.push(newCar);
      });

      this.closeModal();
      this.newCar = { brand: '', model: '', color: '' };
    } else {
      alert('Tous les champs doivent être remplis.');
    }
  }

  openModal(): void {
    const modal = document.getElementById('addCarModal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
      document.body.classList.add('modal-open');
    }
  }

  closeModal(): void {
    const modal = document.getElementById('addCarModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  }

  openConfirmModal(car: Car): void {
    this.carToDelete = car;
    const modal = document.getElementById('confirmDeleteModal');

    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
      document.body.classList.add('modal-open');
    }
  }

  closeConfirmModal(): void {
    const modal = document.getElementById('confirmDeleteModal');

    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  }

  confirmDelete(): void {
    if (this.carToDelete) {
      this.carService.deleteCar(this.carToDelete.id).subscribe(() => {
        this.cars = this.cars.filter((u) => u.id !== this.carToDelete?.id);
        console.log(`Utilisateur ${this.carToDelete.brand} supprimé.`);
        this.closeConfirmModal();
        this.carToDelete = { id: '', brand: '', model: '', color: '' }; 
      });
    }
  }

  openEditModal(car: any): void {
    this.selectedCar = { ...car }; 
    const modal = document.getElementById('editCarModal');

    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
      document.body.classList.add('modal-open');
    }
  }

  closeEditModal(): void {
    const modal = document.getElementById('editCarModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
    this.confirmChanges = false; 
  }

  saveChanges(): void {
    if (this.selectedCar.brand && this.selectedCar.model && this.selectedCar.color) {
      this.carService.updateCar(this.selectedCar).subscribe((updatedCar) => {
        const index = this.cars.findIndex((car) => car.id === updatedCar.id);
        if (index !== -1) {
          this.cars[index] = updatedCar; 
        }
        console.log(`Utilisateur ${updatedCar.brand} modifié.`);
        this.closeEditModal(); 
      });
    } else {
      alert('Tous les champs doivent être remplis.');
    }
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'Administrateur';
  }

    itemsPerPage = 5; 
    currentPage = 1; 
  
    get totalPages(): number {
      return Math.ceil(this.cars.length / this.itemsPerPage);
    }
  
    isNextDisabled(): boolean {
      return this.currentPage >= this.totalPages;
    }
  
    isPreviousDisabled(): boolean {
      return this.currentPage <= 1;
    }
  
    goToPage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  
    get paginatedCars(): Car[] {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.cars.slice(start, end);
    }
}
