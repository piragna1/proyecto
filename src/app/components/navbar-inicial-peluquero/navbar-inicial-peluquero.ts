import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-navbar-inicial-peluquero',
  imports: [RouterLink],
  templateUrl: './navbar-inicial-peluquero.html',
  styleUrl: './navbar-inicial-peluquero.css',
})
export class NavbarInicialPeluquero {
  as: AuthService = inject(AuthService);
  onLogOut() {
    this.as.logOut();
    localStorage.removeItem('usuario');
  }
}
