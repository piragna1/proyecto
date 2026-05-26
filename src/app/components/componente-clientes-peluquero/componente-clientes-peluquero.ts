import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-clientes-peluquero',
  imports: [RouterLink],
  templateUrl: './componente-clientes-peluquero.html',
  styleUrl: './componente-clientes-peluquero.css',
})
export class ComponenteClientesPeluquero implements OnInit {
  us: UsuarioService = inject(UsuarioService);
  clientes = this.us.getUsuariosSignal();
  ngOnInit(): void {
    this.us.getUsuarios().subscribe({
      next: (usuarios) => {
        console.log(usuarios);
        const clientes = usuarios.filter((u) => { return u.rol === 'cliente' });
        console.log(clientes);
        clientes.forEach(element => {
          this.us.setUserSignal(element);
        });
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
