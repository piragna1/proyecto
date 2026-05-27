import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-navbar-usuario-home',
  imports: [RouterLink],
  templateUrl: './navbar-usuario-home.html',
  styleUrl: './navbar-usuario-home.css',
})
export class NavbarUsuarioHome {
  as: AuthService = inject(AuthService);
  onLogOut() {
    this.as.logOut();
    localStorage.removeItem('usuario');
  }
}
