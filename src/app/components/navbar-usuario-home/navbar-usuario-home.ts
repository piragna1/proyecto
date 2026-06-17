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
    const payload = this.as.obtenerPayload();
    console.log(payload);
    

    if (!payload.id) return;
    this.r.navigateByUrl(`/editar-perfil/${payload.id}`);
  }
}
