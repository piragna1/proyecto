import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-home',
  imports: [],
  templateUrl: './componente-home.html',
  styleUrl: './componente-home.css',
})
export class ComponenteHome implements OnInit {
  as: AuthService = inject(AuthService);
  us: UsuarioService = inject(UsuarioService);
  r: Router = inject(Router);
  usuario = signal<string>('Usuario');
  // En true mientras el dashboard se funde antes de navegar a nuevo turno.
  saliendo = signal(false);

  editarPerfil() {
    const payload = this.as.obtenerPayload();
    if (!payload?.id) return;
    this.navegar(`/editar-perfil/${payload.id}`);
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
