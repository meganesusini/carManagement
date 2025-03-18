import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  
    constructor(
      private authService: AuthService
    ) {}
    
    ngOnInit(): void {
      this.currentUser = this.authService.getAuthenticatedUser();
      console.log('Utilisateur connecté :', this.currentUser);
    }
  logout(): void {
    console.log('Utilisateur déconnecté');
    localStorage.clear();
    window.location.href = '/login'; 
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'Administrateur';
  }
}
