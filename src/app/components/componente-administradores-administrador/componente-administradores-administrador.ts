import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { ConfirmarEliminacion } from '../../shared/components/confirmar-eliminacion/confirmar-eliminacion';

@Component({
  selector: 'app-componente-administradores-administrador',
  imports: [RouterLink, ConfirmarEliminacion],
  templateUrl: './componente-administradores-administrador.html',
  styleUrl: './componente-administradores-administrador.css',
})
export class ComponenteAdministradoresAdministrador implements OnInit {
  us: UsuarioService = inject(UsuarioService);
  administradores = this.us.getAdministradoresSignal();
  r: Router = inject(Router);

  // Confirmación de eliminación
  itemAEliminar = signal<{ id: string; nombre: string } | null>(null);

  confirmarEliminacion(id: string | undefined, nombre: string | null | undefined) {
    if (!id) return;
    this.itemAEliminar.set({ id, nombre: nombre ?? '' });
  }

  cancelarEliminacion() {
    this.itemAEliminar.set(null);
  }

  ejecutarEliminacion() {
    const item = this.itemAEliminar();
    if (!item) return;
    this.eliminarAdministrador(item.id);
    this.itemAEliminar.set(null);
  }

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
