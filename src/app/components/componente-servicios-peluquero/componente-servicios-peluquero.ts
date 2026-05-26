import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ServicioService } from '../../servicio/services/servicio-service';
import { Servicio } from '../../servicio/interface/servicio.interface';

@Component({
  selector: 'app-componente-servicios-peluquero',
  imports: [RouterLink],
  templateUrl: './componente-servicios-peluquero.html',
  styleUrl: './componente-servicios-peluquero.css',
})
export class ComponenteServiciosPeluquero implements OnInit {
  ss: ServicioService = inject(ServicioService);
  servicios = this.ss.getServiciosSignal();
  ngOnInit(): void {
    this.ss.getServicios().subscribe({
      next: (s: any[]) => {
        console.log(s);
        s.forEach(element => {
          console.log('elemento', element);
          const servicio: Servicio = {
            id: element.id,
            tipo: element.tipo,
            duracionMinutos: element.duracion_minutos,
            precio: element.precio
          };
          console.log('servicio construido:', servicio);

          this.ss.setServiciosSignal(servicio)
        });
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
