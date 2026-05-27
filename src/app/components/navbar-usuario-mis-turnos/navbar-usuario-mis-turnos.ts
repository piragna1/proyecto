import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-navbar-usuario-mis-turnos',
  imports: [RouterLink],
  templateUrl: './navbar-usuario-mis-turnos.html',
  styleUrl: './navbar-usuario-mis-turnos.css',
})
export class NavbarUsuarioMisTurnos {
  as: AuthService = inject(AuthService);
  onLogOut() {
    this.as.logOut();
    localStorage.removeItem('usuario');
  }
}
