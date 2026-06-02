import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-navbar-usuario-home',
  imports: [RouterLink],
  templateUrl: './navbar-usuario-home.html',
  styleUrl: './navbar-usuario-home.css',
})
export class NavbarUsuarioHome {
  as: AuthService = inject(AuthService);
  r: Router = inject(Router);
  onLogOut() {
    this.as.logOut();
    localStorage.removeItem('token');
  }
  onEditarPerfil() {
    const usuario = JSON.parse(localStorage.getItem('usuario') ?? 'null') as { id?: string } | null;

    if (!usuario?.id) return;
    this.r.navigateByUrl(`/editar-perfil/${usuario.id}`);
  }
}
