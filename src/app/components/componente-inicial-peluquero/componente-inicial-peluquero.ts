import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-inicial-peluquero',
  imports: [RouterLink],
  templateUrl: './componente-inicial-peluquero.html',
  styleUrl: './componente-inicial-peluquero.css',
})
export class ComponenteInicialPeluquero implements OnInit {
  r: Router = inject(Router);
  as: AuthService = inject(AuthService);
  us: UsuarioService = inject(UsuarioService);
  usuario = signal<string>('Usuario');

  irAPerfil() {
    const payload = this.as.obtenerPayload();
    if (!payload.id) return;
    this.r.navigateByUrl(`/editar-perfil-peluquero/${payload.id}`);
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
