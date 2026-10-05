import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-inicial-peluquero',
  imports: [],
  templateUrl: './componente-inicial-peluquero.html',
  styleUrl: './componente-inicial-peluquero.css',
})
export class ComponenteInicialPeluquero implements OnInit {
  r: Router = inject(Router);
  as: AuthService = inject(AuthService);
  us: UsuarioService = inject(UsuarioService);
  usuario = signal<string>('Usuario');

  // En true mientras el dashboard se funde antes de navegar.
  saliendo = signal(false);

  irAPerfil() {
    const payload = this.as.obtenerPayload();
    if (!payload.id) return;
    this.navegar(`/editar-perfil-peluquero/${payload.id}`);
  }

  /**
   * Funde el dashboard y despues navega a la ruta indicada. El retardo
   * coincide con la transicion CSS de salida (.saliendo).
   * @param ruta destino de la navegacion
   * @returns void
   */
  navegar(ruta: string) {
    if (this.saliendo()) return;
    this.saliendo.set(true);
    setTimeout(() => {
      this.r.navigateByUrl(ruta);
    }, 300);
  }

  ngOnInit(): void {
    const payload = this.as.obtenerPayload();

    if (!payload?.id) return;

    this.us.getUsuarioById(payload.id).subscribe({
      next: (u) => {
        this.usuario.set(u.nombre);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
