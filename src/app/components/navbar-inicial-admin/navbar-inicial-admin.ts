import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-navbar-inicial-admin',
  imports: [RouterLink],
  templateUrl: './navbar-inicial-admin.html',
  styleUrl: './navbar-inicial-admin.css',
})
export class NavbarInicialAdmin {
  as: AuthService = inject(AuthService);
  onLogout() {
    localStorage.removeItem('usuario');
    this.as.logOut();
  };
}
