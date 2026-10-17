import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { ConfirmarEliminacion } from '../../shared/components/confirmar-eliminacion/confirmar-eliminacion';

@Component({
  selector: 'app-componente-clientes-administrador',
  imports: [RouterLink, ConfirmarEliminacion],
  templateUrl: './componente-clientes-administrador.html',
  styleUrl: './componente-clientes-administrador.css',
})
export class ComponenteClientesAdministrador implements OnInit {
  us: UsuarioService = inject(UsuarioService);
  usuarios = this.us.getUsuariosSignal();

  // Confirmación de eliminación
  itemAEliminar = signal<{ id: string; nombre: string } | null>(null);

  confirmarEliminacion(id: string | undefined, nombre: string | undefined) {
    if (!id) return;
    this.itemAEliminar.set({ id, nombre: nombre ?? '' });
  }

  cancelarEliminacion() {
    this.itemAEliminar.set(null);
  }

  ejecutarEliminacion() {
    const item = this.itemAEliminar();
    if (!item) return;
    this.eliminarUsuario(item.id);
    this.itemAEliminar.set(null);
  }

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
        this.us.removerUsuario(id!);
      },
      error: (err) => {
        console.log(err);
      }
    });
  };
};