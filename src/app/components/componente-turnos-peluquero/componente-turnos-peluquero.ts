import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../turno/services/turno-service';
import { ServicioService } from '../../servicio/services/servicio-service';
import { UsuarioService } from '../../usuario/services/usuario-service';
import { Turno } from '../../turno/interface/turno.interface';
import { PagoService } from '../../pago/services/pago-service';
import { ToastService } from '../../shared/services/toast-service';

@Component({
  selector: 'app-componente-turnos-peluquero',
  imports: [RouterLink, FormsModule],
  templateUrl: './componente-turnos-peluquero.html',
  styleUrl: './componente-turnos-peluquero.css',
})
export class ComponenteTurnosPeluquero implements OnInit {
  ts: TurnoService = inject(TurnoService);
  ss: ServicioService = inject(ServicioService);
  us: UsuarioService = inject(UsuarioService);
  ps: PagoService = inject(PagoService);
  toast: ToastService = inject(ToastService);
  turnos = this.ts.getTurnosSignal();
  fecha: string = '';
  cobrarTurno: Turno | null = null;
  metodo: string = 'efectivo';
  monto: number | null = null;
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
                    servicio: s,
                    pagado: Number(element.pagado) === 1
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

  abrirCobro(turno: Turno) {
    this.cobrarTurno = turno;
    this.metodo = 'efectivo';
    this.monto = turno.servicio.precio;
  };

  cerrarCobro() {
    this.cobrarTurno = null;
  };

  confirmarCobro() {
    if (!this.cobrarTurno || !this.cobrarTurno.id || this.monto === null || this.monto <= 0) {
      this.toast.mostrarMensaje('El monto debe ser mayor a cero', true);
      return;
    }
    const idTurno = this.cobrarTurno.id;
    this.ps.postPago({ idTurno, metodo: this.metodo, monto: this.monto }).subscribe({
      next: (p) => {
        console.log('pago registrado:', p);
        this.marcarPagado(idTurno);
        this.cerrarCobro();
        this.toast.mostrarMensaje('Pago registrado');
      },
      error: (err) => {
        console.log(err);
        this.toast.mostrarMensaje('No se pudo registrar el pago', true);
      }
    });
  };

  marcarPagado(id: string) {
    this.turnos.update(actuales =>
      actuales.map(t => t.id === id ? { ...t, pagado: true } : t)
    );
  };
}