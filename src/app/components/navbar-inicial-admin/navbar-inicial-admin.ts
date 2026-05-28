import { Component, inject } from '@angular/core';
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
  onLogout() {
    localStorage.removeItem('usuario');
    this.as.logOut();
  };
  onEditarPefilAdmin() {
    const usuarioData = localStorage.getItem('usuario');
    if (!usuarioData) return;
    const usuario = JSON.parse(usuarioData);
    this.r.navigateByUrl(`/editar-perfil-administrador/${usuario.id}`);
  }
}
