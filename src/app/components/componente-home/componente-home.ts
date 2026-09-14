import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-home',
  imports: [RouterLink],
  templateUrl: './componente-home.html',
  styleUrl: './componente-home.css',
})
export class ComponenteHome implements OnInit {
  as: AuthService = inject(AuthService);
  us: UsuarioService = inject(UsuarioService);
  usuario = signal<string>('Usuario');

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
