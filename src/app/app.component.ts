import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'carManagement';

  // showHeader = true;
  // showFooter = true;

  // constructor(private router: Router) {}
  // ngOnInit() {
  //   this.router.events.subscribe(() => {
  //     this.showHeader = this.router.url !== '/login';  
  //     this.showFooter = this.router.url !== '/login';  
  //   });
  // }
}
