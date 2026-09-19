import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-navbar-inicial-admin',
  imports: [RouterLink],
  templateUrl: './navbar-inicial-admin.html',
  styleUrl: './navbar-inicial-admin.css',
})
export class NavbarInicialAdmin {
  as: AuthService = inject(AuthService);
  r: Router = inject(Router);
  mostrarInicio = signal(this.r.url !== '/home-admin');
  onLogout() {
    this.as.cerrarSesion();
  };
  onEditarPefilAdmin() {
    const payload = this.as.obtenerPayload();
    if (!payload.id) return;
    this.r.navigateByUrl(`/editar-perfil-administrador/${payload.id}`);
  }
}
