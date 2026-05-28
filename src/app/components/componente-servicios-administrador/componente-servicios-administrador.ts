import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicioService } from '../../servicio/services/servicio-service';

@Component({
  selector: 'app-componente-servicios-administrador',
  imports: [RouterLink],
  templateUrl: './componente-servicios-administrador.html',
  styleUrl: './componente-servicios-administrador.css',
})
export class ComponenteServiciosAdministrador implements OnInit {
  ss: ServicioService = inject(ServicioService);
  servicios = this.ss.getServiciosSignal();
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
            duracionMinutos: s.duracion_minutos,
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
