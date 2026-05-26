import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-peluqueros-administrador',
  imports: [RouterLink],
  templateUrl: './componente-peluqueros-administrador.html',
  styleUrl: './componente-peluqueros-administrador.css',
})
export class ComponentePeluquerosAdministrador implements OnInit {
  us: UsuarioService = inject(UsuarioService);
  peluqueros = this.us.getPeluquerosSignal();
  ngOnInit(): void {
    this.us.getUsuarios().subscribe({
      next: (usuarios) => {
        console.log(usuarios);
        const peluqueros = usuarios.filter((u) => u.rol === 'peluquero');
        console.log(peluqueros);
        peluqueros.forEach(element => {
          this.us.setPeluquerosSignal(element);
        });
      },
      error: (err) => { console.log(err); }
    })
  }
}
