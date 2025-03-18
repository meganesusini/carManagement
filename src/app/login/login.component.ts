import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe((isValid) => {
      if (isValid) {
        console.log('Connexion réussie !');
        this.router.navigate(['/header/home']); 
      } else {
        this.errorMessage = 'Login ou mot de passe incorrect.';
      }
    });
  }
}
