import { Component, computed, inject, OnInit, signal } from '@angular/core';
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

  orden = signal<'cliente' | 'telefono' | 'servicio' | 'horario' | 'pago'>('horario');
  direccion = signal<'asc' | 'desc'>('asc');
  turnosOrdenados = computed(() => {
    const dir = this.direccion() === 'asc' ? 1 : -1;
    return this.turnos()
      .slice()
      .sort((a, b) => {
        let r = 0;
        switch (this.orden()) {
          case 'cliente':
            r = (a.usuario?.nombre ?? '').localeCompare(b.usuario?.nombre ?? '', 'es');
            break;
          case 'telefono':
            r = (a.usuario?.telefono ?? '').localeCompare(b.usuario?.telefono ?? '');
            break;
          case 'servicio':
            r = a.servicio.tipo.localeCompare(b.servicio.tipo, 'es');
            break;
          case 'pago':
            r = Number(a.pagado ?? false) - Number(b.pagado ?? false);
            break;
          default:
            r = (a.fechaHoraInicioRaw ?? a.fechaHoraInicio).localeCompare(b.fechaHoraInicioRaw ?? b.fechaHoraInicio);
        }
        return r * dir;
      });
  });

  ngOnInit(): void {
    this.cargarTurnos();
  }

  accionOrdenar(campo: 'cliente' | 'telefono' | 'servicio' | 'horario' | 'pago') {
    if (this.orden() === campo) {
      this.direccion.set(this.direccion() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orden.set(campo);
      this.direccion.set('asc');
    }
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
                    fechaHoraInicioRaw: element.fecha_hora_inicio,
                    servicio: s,
                    pagado: Number(element.pagado) === 1,
                    monto: element.monto_pagado != null ? Number(element.monto_pagado) : undefined
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