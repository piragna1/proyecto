import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-navbar-usuario-nuevo-turno',
  imports: [RouterLink],
  templateUrl: './navbar-usuario-nuevo-turno.html',
  styleUrl: './navbar-usuario-nuevo-turno.css',
})
export class NavbarUsuarioNuevoTurno {
  as: AuthService = inject(AuthService);
  r: Router = inject(Router);
  onLogOut() {
    this.as.logOut();
    localStorage.removeItem('token');
  }
  onEditarPerfil() {
    const payload = this.as.obtenerPayload();

    if (!payload.id) return;
    this.r.navigateByUrl(`/editar-perfil/${payload.id}`);
  }
}
