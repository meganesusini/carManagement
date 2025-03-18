import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  newUser: Omit<User, 'id'> = {
    lastname: '',
    firstname: '',
    email: '',
    login: '',
    pwd: '',
    role: 'Utilisateur',
  };

  userToDelete: User = {
    id: '',
    lastname: '',
    firstname: '',
    email: '',
    login: '',
    pwd: '',
    role: 'Utilisateur',
  };

  selectedUser: User = {
    id: '',
    lastname: '',
    firstname: '',
    email: '',
    login: '',
    pwd: '',
    role: 'Utilisateur',
  };

  confirmPassword = '';
  confirmChanges = false;

  currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getAuthenticatedUser();
    console.log('Utilisateur connecté :', this.currentUser);
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  // ADD
  addUser(): void {
    if (
      this.newUser.lastname &&
      this.newUser.firstname &&
      this.newUser.email &&
      this.newUser.login &&
      this.newUser.pwd
    ) {
      this.userService.addUser(this.newUser).subscribe((newUser) => {
        this.users.push(newUser);
      });

      this.closeModal();
      this.newUser = {
        lastname: '',
        firstname: '',
        email: '',
        login: '',
        pwd: '',
        role: 'Utilisateur',
      };
    } else {
      alert('Tous les champs doivent être remplis.');
    }
  }

  openModal(): void {
    const modal = document.getElementById('addUserModal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
      document.body.classList.add('modal-open');
    }
  }

  closeModal(): void {
    const modal = document.getElementById('addUserModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  }

  // DELETE
  openConfirmModal(user: User): void {
    this.userToDelete = user;
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
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.id).subscribe(() => {
        this.users = this.users.filter((u) => u.id !== this.userToDelete?.id);
        console.log(`Utilisateur ${this.userToDelete.lastname} supprimé.`);
        this.closeConfirmModal();
        this.userToDelete = {
          id: '',
          lastname: '',
          firstname: '',
          email: '',
          login: '',
          pwd: '',
          role: 'Utilisateur',
        };
      });
    }
  }

  // MODIFY
  openEditModal(user: any): void {
    this.selectedUser = { ...user };
    const modal = document.getElementById('editUserModal');

    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
      document.body.classList.add('modal-open');
    }
  }

  closeEditModal(): void {
    const modal = document.getElementById('editUserModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
    this.confirmPassword = '';
    this.confirmChanges = false;
  }

  saveChanges(): void {
    if (
      this.selectedUser.lastname &&
      this.selectedUser.firstname &&
      this.selectedUser.email &&
      this.selectedUser.login &&
      this.selectedUser.pwd &&
      this.selectedUser.pwd === this.confirmPassword
    ) {
      this.userService
        .updateUser(this.selectedUser)
        .subscribe((updatedUser) => {
          const index = this.users.findIndex(
            (user) => user.id === updatedUser.id
          );
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          console.log(`Utilisateur ${updatedUser.lastname} modifié.`);
          this.closeEditModal();
        });
    } else {
      alert(
        'Tous les champs doivent être remplis et les mots de passe doivent correspondre.'
      );
    }
  }

  updateRole(user: User): void {
    this.userService.updateUser(user).subscribe(() => {
      console.log(
        `Rôle mis à jour pour l'utilisateur ${user.lastname}: ${user.role}`
      );
    });
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'Administrateur';
  }

  itemsPerPage = 5;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.users.length / this.itemsPerPage);
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

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.users.slice(start, end);
  }
}
