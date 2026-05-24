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
  constructor() {}
  ngOnInit(): void {
    this.ss.getServicios().subscribe({
      next: (servicios) => {
        console.log(servicios);
        servicios.forEach((s) => {
          this.ss.setServiciosSignal(s);
        });
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
