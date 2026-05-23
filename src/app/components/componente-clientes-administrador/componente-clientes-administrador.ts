import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../usuario/interface/usuario.interface';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-clientes-administrador',
  imports: [RouterLink],
  templateUrl: './componente-clientes-administrador.html',
  styleUrl: './componente-clientes-administrador.css',
})
export class ComponenteClientesAdministrador implements OnInit {
  us: UsuarioService = inject(UsuarioService);
  usuarios: Usuario[] = [];
  constructor() {}
  ngOnInit(): void {
    this.us.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        console.log('usuarios:', this.usuarios);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
