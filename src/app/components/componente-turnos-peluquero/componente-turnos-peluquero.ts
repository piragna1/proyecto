import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TurnoService } from '../../turno/services/turno-service';
import { ServicioService } from '../../servicio/services/servicio-service';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { Turno } from '../../turno/interface/turno.interface';

@Component({
  selector: 'app-componente-turnos-peluquero',
  imports: [RouterLink],
  templateUrl: './componente-turnos-peluquero.html',
  styleUrl: './componente-turnos-peluquero.css',
})
export class ComponenteTurnosPeluquero {
  ts: TurnoService = inject(TurnoService);
  ss: ServicioService = inject(ServicioService);
  us: UsuarioService = inject(UsuarioService);
  turnos = this.ts.getTurnosSignal();
  fecha: string = '';
  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(fecha?: string) {
    this.ts.getTurnos(fecha).subscribe({
      next: (t: any[]) => {
        this.ts.limpiarTurnosSignal();
        t.forEach(element => {
          this.ss.getServicioById(element.id_servicio).subscribe({
            next: (s) => {
              this.us.getUsuarioById(element.id_usuario).subscribe({
                next: (u) => {
                  const turno: Turno = {
                    id: element.id,
                    usuario: u,
                    fechaHoraInicio: new Date(element.fecha_hora_inicio).toLocaleString('es'),
                    fechaHoraFin: new Date(element.fecha_hora_fin).toLocaleString('es'),
                    servicio: s
                  };
                  console.log('turno recuperado: ', turno);
                  this.ts.setTurnosSignal(turno);
                },
                error: (err) => {
                  console.log(err);
                }
              })
            }, error: (err) => {
              console.log(err);
            }
          })
        });
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  filtrarPorDia(event: any) {
    const input = event.target;
    this.fecha = input.value;
    this.cargarTurnos(this.fecha || undefined);
  }

  verTodos() {
    this.fecha = '';
    this.cargarTurnos();
  }
}
