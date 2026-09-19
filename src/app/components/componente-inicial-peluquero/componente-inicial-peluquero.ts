import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-componente-inicial-peluquero',
  imports: [RouterLink],
  templateUrl: './componente-inicial-peluquero.html',
  styleUrl: './componente-inicial-peluquero.css',
})
export class ComponenteInicialPeluquero {
  r: Router = inject(Router);
  as: AuthService = inject(AuthService);
  irAPerfil() {
    const payload = this.as.obtenerPayload();
    if (!payload.id) return;
    this.r.navigateByUrl(`/editar-perfil-peluquero/${payload.id}`);
  }
}
