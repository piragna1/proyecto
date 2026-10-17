import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { UsuarioService } from '../../usuario/services/usuario-service';
import { ConfirmarEliminacion } from '../../shared/components/confirmar-eliminacion/confirmar-eliminacion';

@Component({
  selector: 'app-componente-peluqueros-administrador',
  imports: [RouterLink, ConfirmarEliminacion],
  templateUrl: './componente-peluqueros-administrador.html',
  styleUrl: './componente-peluqueros-administrador.css',
})
export class ComponentePeluquerosAdministrador implements OnInit {
  us: UsuarioService = inject(UsuarioService);
  peluqueros = this.us.getPeluquerosSignal();

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
    this.eliminarPeluquero(item.id);
    this.itemAEliminar.set(null);
  }

  ngOnInit(): void {
    this.us.limpiarPeluquerosSignal();
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
  };
  eliminarPeluquero(id: string | undefined) {
    this.us.deleteUsuario(id).subscribe({
      next: (value) => {
        console.log('peluquero eliminado:', value);
        this.us.removerPeluquero(id!);
      },
      error: (err) => {
        console.log(err);

      }
    })
  }
}
