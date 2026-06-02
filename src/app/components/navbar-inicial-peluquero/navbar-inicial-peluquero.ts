import { Component, inject } from '@angular/core';
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
  onLogOut() {
    this.as.logOut();
    localStorage.removeItem('token');
  }
  onEditarPerfilPeluquero() {
    const usuarioData = localStorage.getItem('usuario');
    if (!usuarioData) return;
    const usuario = JSON.parse(usuarioData);
    this.r.navigateByUrl('/editar-perfil-peluquero/' + usuario.id);
  }
}
