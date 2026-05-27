import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-navbar-usuario-nuevo-turno',
  imports: [RouterLink],
  templateUrl: './navbar-usuario-nuevo-turno.html',
  styleUrl: './navbar-usuario-nuevo-turno.css',
})
export class NavbarUsuarioNuevoTurno {
  as: AuthService = inject(AuthService);
  onLogOut() {
    this.as.logOut();
    localStorage.removeItem('usuario');
  }
}
