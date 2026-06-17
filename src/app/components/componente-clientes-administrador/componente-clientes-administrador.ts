import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-clientes-administrador',
  imports: [RouterLink],
  templateUrl: './componente-clientes-administrador.html',
  styleUrl: './componente-clientes-administrador.css',
})
export class ComponenteClientesAdministrador implements OnInit {
  us: UsuarioService = inject(UsuarioService);
  usuarios = this.us.getUsuariosSignal();
  constructor() { }
  ngOnInit(): void {
    this.us.getUsuarios().subscribe({
      next: (usuarios) => {
        console.log(usuarios);
        usuarios.forEach((u) => {
          if (u.rol === 'cliente') {
            this.us.setUserSignal(u);
          }
        });
      },
      error: (e) => {
        console.log(e);
      },
    });
  };
  eliminarUsuario(id: string | undefined) {
    this.us.deleteUsuario(id).subscribe({
      next: (value) => {
        console.log('usuario eliminado:', value);
      },
      error: (err) => {
        console.log(err);
      }
    });
  };
};