import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  r: Router = inject(Router);
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
    });
  };
  eliminarAdministrador(id: string | undefined) {
    this.us.deleteUsuario(id).subscribe({
      next: (value) => {
        console.log('admin eliminado:', value);
        this.us.removerAdmin(id!);
      },
      error: (err) => {
        console.log(err);

      }
    })
  }
};
