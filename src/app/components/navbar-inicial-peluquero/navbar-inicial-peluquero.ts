import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-navbar-inicial-peluquero',
  imports: [RouterLink],
  templateUrl: './navbar-inicial-peluquero.html',
  styleUrl: './navbar-inicial-peluquero.css',
})
export class NavbarInicialPeluquero {
  as: AuthService = inject(AuthService);
  r: Router = inject(Router);
  mostrarInicio = signal(this.r.url !== '/home-peluquero');
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
  onEditarPerfilPeluquero() {
    const payload = this.as.obtenerPayload();
    if (!payload.id) return;
    this.r.navigateByUrl('/editar-perfil-peluquero/' + payload.id);
  }
}
