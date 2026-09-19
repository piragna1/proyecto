import { Component, inject, signal } from '@angular/core';
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
  abierto = signal(false);
  alternar() {
    this.abierto.update((v) => !v);
  }
  cerrar() {
    this.abierto.set(false);
  }
  onLogOut() {
    this.as.cerrarSesion();
  }
  onEditarPerfil() {
    const payload = this.as.obtenerPayload();

    if (!payload.id) return;
    this.r.navigateByUrl(`/editar-perfil/${payload.id}`);
  }
}
