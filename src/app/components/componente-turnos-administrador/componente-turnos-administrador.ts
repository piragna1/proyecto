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
  selector: 'app-componente-turnos-administrador',
  imports: [RouterLink, FormsModule],
  templateUrl: './componente-turnos-administrador.html',
  styleUrl: './componente-turnos-administrador.css',
})
export class ComponenteTurnosAdministrador implements OnInit {
  ts: TurnoService = inject(TurnoService);
  ss: ServicioService = inject(ServicioService);
  us: UsuarioService = inject(UsuarioService);
  ps: PagoService = inject(PagoService);
  toast: ToastService = inject(ToastService);
  turnos = this.ts.getTurnosSignal();
  fecha = signal<string>('');
  cobrarTurno: Turno | null = null;
  metodo: string = 'efectivo';
  monto: number | null = null;
  diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  mesVisible = computed(() => {
    const base = this.fecha() ? new Date(this.fecha() + 'T12:00:00') : new Date();
    return base.getMonth();
  });
  anioVisible = computed(() => {
    const base = this.fecha() ? new Date(this.fecha() + 'T12:00:00') : new Date();
    return base.getFullYear();
  });
  nombreMes = computed(() => {
    const n = new Date(this.anioVisible(), this.mesVisible(), 1).toLocaleString('es', { month: 'long' });
    return n.charAt(0).toUpperCase() + n.slice(1);
  });
  etiquetaDia = computed(() => {
    if (!this.fecha()) return 'Todos';
    return new Date(this.fecha() + 'T12:00:00').toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  });
  diasMes = computed(() => {
    const base = this.fecha() ? new Date(this.fecha() + 'T12:00:00') : new Date();
    const mes = base.getMonth();
    const anio = base.getFullYear();
    const offset = (new Date(anio, mes, 1).getDay() + 6) % 7;
    const ultimoDia = new Date(anio, mes + 1, 0).getDate();
    const hoyStr = this.aYYYYMMDD(new Date());
    const celdas: { num: number | null; fecha: string; esHoy: boolean }[] = [];
    for (let i = 0; i < offset; i++) {
      celdas.push({ num: null, fecha: '', esHoy: false });
    }
    for (let d = 1; d <= ultimoDia; d++) {
      const fechaStr = this.aYYYYMMDD(new Date(anio, mes, d));
      celdas.push({ num: d, fecha: fechaStr, esHoy: fechaStr === hoyStr });
    }
    while (celdas.length < 42) {
      celdas.push({ num: null, fecha: '', esHoy: false });
    }
    return celdas;
  });

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
  };

  accionOrdenar(campo: 'cliente' | 'telefono' | 'servicio' | 'horario' | 'pago') {
    if (this.orden() === campo) {
      this.direccion.set(this.direccion() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orden.set(campo);
      this.direccion.set('asc');
    }
  };

  cargarTurnos(fecha?: string) {
    this.ts.getTurnos(fecha).subscribe({
      next: (t: any[]) => {
        console.log(t);
        this.ts.limpiarTurnosSignal();
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
                    fechaHoraInicioRaw: element.fecha_hora_inicio,
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
  };

  aYYYYMMDD(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  seleccionarDia(fechaStr: string) {
    this.fecha.set(fechaStr);
    this.cargarTurnos(fechaStr);
  };

  cambiarDia(delta: number) {
    const base = this.fecha() ? new Date(this.fecha() + 'T12:00:00') : new Date();
    base.setDate(base.getDate() + delta);
    const nueva = this.aYYYYMMDD(base);
    this.fecha.set(nueva);
    this.cargarTurnos(nueva);
  };

  verTodos() {
    this.fecha.set('');
    this.cargarTurnos();
  };

  irAHoy() {
    const hoy = this.aYYYYMMDD(new Date());
    this.fecha.set(hoy);
    this.cargarTurnos(hoy);
  };

  hoyActual(): string {
    return this.aYYYYMMDD(new Date());
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
};