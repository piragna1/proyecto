import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { TurnoService } from '../../turno/services/turno-service';
import { Turno } from '../../turno/interface/turno.interface';
import { ServicioService } from '../../servicio/services/servicio-service';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { ToastService } from '../../shared/services/toast-service';
import { AuthService } from '../../auth/services/auth-service';

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
  r: Router = inject(Router);
  turnos = this.ts.getTurnosSignal();
  toastService: ToastService = inject(ToastService);
  as:AuthService = inject(AuthService);
  ngOnInit(): void {
    this.ts.limpiarTurnosSignal();
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
                    fechaHoraFin: new Date(t.fecha_hora_fin).toLocaleString('es'),
                    fechaHoraInicio: new Date(t.fecha_hora_inicio).toLocaleString('es'),
                    servicio: servicio,
                    usuario: usuario
                  };
                  console.log('turno recuperado:', turno)
                  //Corroborar que el id del usuario coincida con el del usuario logueado.
                  const payload = this.as.obtenerPayload();
                  const id = payload.id;
                  if (id !== usuario.id) return;
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
        this.toastService.mostrarMensaje('Turno eliminado correctamente.')
      }, error: (err) => {
        console.log(err);
      }
    });
  };
}
