import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TurnoService } from '../../turno/services/turno-service';
import { Turno } from '../../turno/interface/turno.interface';
import { ServicioService } from '../../servicio/services/servicio-service';
import { UsuarioService } from '../../usuario/services/usuario-service';

@Component({
  selector: 'app-componente-mis-turnos',
  imports: [RouterLink],
  templateUrl: './componente-mis-turnos.html',
  styleUrl: './componente-mis-turnos.css',
})
export class ComponenteMisTurnos implements OnInit {
  ts: TurnoService = inject(TurnoService);
  ss: ServicioService = inject(ServicioService);
  us: UsuarioService = inject(UsuarioService);
  turnos = this.ts.getTurnosSignal();
  ngOnInit(): void {
    this.ts.getTurnos().subscribe({
      next: (turnos) => {
        console.log(turnos);
        turnos.forEach(t => {
          this.ss.getServicioById(t.id_servicio).subscribe({
            next: (servicio) => {
              console.log(servicio);
              this.us.getUsuarioById(t.id_usuario).subscribe({
                next: (usuario) => {
                  console.log(usuario);
                  const turno: Turno = {
                    id: t.id,
                    fechaHoraFin: t.fecha_hora_fin,
                    fechaHoraInicio: t.fecha_hora_inicio,
                    servicio: servicio,
                    usuario: usuario
                  };
                  console.log('turno recuperado:', turno)
                  //Corroborar que el id del usuario coincida con el del usuario logueado.
                  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario') || '{}');
                  if (usuarioLogueado.id !== usuario.id) return;
                  this.ts.setTurnosSignal(turno);
                }, error: (err) => {
                  console.log(err);
                }
              })
            },
            error: (err) => {
              console.log(err);
            }
          })
        });
      },
      error: (e) => {
        console.log(e);
      }
    });
  };

  cancelarTurno(id: string | undefined) {
    if (!id) return;
    this.ts.deleteTurno(id).subscribe({
      next: () => {
        this.ts.removerTurno(id);
      }, error: (err) => {
        console.log(err);
      }
    })
  };
}
