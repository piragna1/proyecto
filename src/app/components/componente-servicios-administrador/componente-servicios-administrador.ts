import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicioService } from '../../servicio/services/servicio-service';
import { ConfirmarEliminacion } from '../../shared/components/confirmar-eliminacion/confirmar-eliminacion';

@Component({
  selector: 'app-componente-servicios-administrador',
  imports: [RouterLink, ConfirmarEliminacion],
  templateUrl: './componente-servicios-administrador.html',
  styleUrl: './componente-servicios-administrador.css',
})
export class ComponenteServiciosAdministrador implements OnInit {
  ss: ServicioService = inject(ServicioService);
  servicios = this.ss.getServiciosSignal();

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
    this.eliminarServicio(item.id);
    this.itemAEliminar.set(null);
  }

  constructor() { }
  ngOnInit(): void {
    this.ss.limpiarServiciosSignal();
    this.ss.getServicios().subscribe({
      next: (servicios) => {
        console.log(servicios);
        servicios.forEach((s: any) => {
          this.ss.setServiciosSignal({
            id: s.id,
            tipo: s.tipo,
            precio: s.precio
          });
        });
      },
      error: (e) => {
        console.log(e);
      },
    });
  };
  eliminarServicio(id: string | undefined) {
    this.ss.deleteServicio(id).subscribe({
      next: (value) => {
        console.log('servicio eliminado: ', value);
        this.ss.removerServicio(id!);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
};
