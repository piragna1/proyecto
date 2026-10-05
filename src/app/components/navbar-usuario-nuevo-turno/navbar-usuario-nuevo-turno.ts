import { Component, inject, Input, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-navbar-usuario-nuevo-turno',
  imports: [RouterLink],
  templateUrl: './navbar-usuario-nuevo-turno.html',
  styleUrl: './navbar-usuario-nuevo-turno.css',
})
export class NavbarUsuarioNuevoTurno {
  // En true renderiza una barra minima transparente con solo LogOut
  // (para paginas full-screen como nuevo turno).
  @Input() minimal = false;
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
    // Navega al login: cerrarSesion solo limpia la sesion, sin navegacion
    // los guards no se re-ejecutan y la pagina quedaria pintada.
    this.r.navigateByUrl('/');
  }
  onEditarPerfil() {
    const payload = this.as.obtenerPayload();

    if (!payload.id) return;
    this.r.navigateByUrl(`/editar-perfil/${payload.id}`);
  }
}
