import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TurnoService } from '../../turno/services/turno-service';
import { ServicioService } from '../../servicio/services/servicio-service';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { Turno } from '../../turno/interface/turno.interface';

@Component({
  selector: 'app-componente-turnos-administrador',
  imports: [RouterLink],
  templateUrl: './componente-turnos-administrador.html',
  styleUrl: './componente-turnos-administrador.css',
})
export class ComponenteTurnosAdministrador implements OnInit {
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
  };

  eliminarTurno(id: string | null) {
    this.ts.deleteTurno(id).subscribe({
      next: (t) => {
        console.log('turno eliminado:', t);
        this.ts.removerTurno(id);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
};
