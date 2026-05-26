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
  ngOnInit(): void {
    this.ts.getTurnos().subscribe({
      next: (t: any[]) => {
        console.log(t);
        t.forEach(element => {
          this.ss.getServicioById(element.id_servicio).subscribe({
            next: (s) => {
              console.log(s);
              this.us.getUsuarioById(element.id_usuario).subscribe({
                next: (u) => {
                  console.log(u);
                  const turno: Turno = {
                    usuario: u,
                    fechaHoraInicio: element.fecha_hora_inicio,
                    fechaHoraFin: element.fecha_hora_fin,
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
}
