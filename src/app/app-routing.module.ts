import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { CarsComponent } from './cars/cars.component';
import { HeaderComponent } from './header/header.component';

const routes: Routes = [
  { path : 'header', component: HeaderComponent, canActivate: [AuthGuard],
    children : [
      { path :'home', component: DashboardComponent  },
      { path :'users', component: UsersComponent },
      { path :'cars', component: CarsComponent },
    ]
   },
  
  { path :'login', component: LoginComponent },
  { path :'', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
