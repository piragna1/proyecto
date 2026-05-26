import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-administradores-administrador',
  imports: [RouterLink],
  templateUrl: './componente-administradores-administrador.html',
  styleUrl: './componente-administradores-administrador.css',
})
export class ComponenteAdministradoresAdministrador implements OnInit {
  us: UsuarioService = inject(UsuarioService);
  administradores = this.us.getAdministradoresSignal();
  ngOnInit(): void {
    this.us.getUsuarios().subscribe({
      next: (u) => {
        const administradores = u.filter((u) => u.rol === 'administrador');
        console.log(administradores);
        administradores.forEach(element => {
          this.us.setAdministradoresSignal(element);
        });
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
