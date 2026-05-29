import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-navbar-usuario-mis-turnos',
  imports: [RouterLink],
  templateUrl: './navbar-usuario-mis-turnos.html',
  styleUrl: './navbar-usuario-mis-turnos.css',
})
export class NavbarUsuarioMisTurnos {
  as: AuthService = inject(AuthService);
  r: Router = inject(Router);
  onLogOut() {
    this.as.logOut();
    localStorage.removeItem('usuario');
  }
  onEditarPerfil() {
    const usuario = JSON.parse(localStorage.getItem('usuario') ?? 'null') as { id?: string } | null;

    if (!usuario?.id) return;
    this.r.navigateByUrl(`/editar-perfil/${usuario.id}`);
  }
}
