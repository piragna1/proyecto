import { Component, computed, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { NotificacionService } from '../../notificacion/services/notificacion-service';
import { NotificacionPagina } from '../../notificacion/interface/notificacion.interface';

type CampoFiltro = 'desde' | 'hasta' | 'usuario' | 'tipo' | 'motivo' | 'telefono' | 'mensaje' | 'estado';
type CampoOrden = 'fecha' | 'usuario' | 'tipo' | 'motivo' | 'telefono' | 'mensaje' | 'estado';

@Component({
  selector: 'app-componente-notificaciones-administrador',
  imports: [RouterLink, DatePipe],
  templateUrl: './componente-notificaciones-administrador.html',
  styleUrl: './componente-notificaciones-administrador.css',
})
export class ComponenteNotificacionesAdministrador implements OnInit, OnDestroy {
  ns: NotificacionService = inject(NotificacionService);
  notificaciones = this.ns.getNotificacionesSignal();

  readonly TAMANIO_PAGINA = 25;

  filtros: Record<CampoFiltro, WritableSignal<string>> = {
    desde: signal(''),
    hasta: signal(''),
    usuario: signal(''),
    tipo: signal(''),
    motivo: signal(''),
    telefono: signal(''),
    mensaje: signal(''),
    estado: signal(''),
  };

  orden = signal<string>('');
  direccion = signal<'asc' | 'desc'>('desc');

  // Calendario popup propio para Desde/Hasta (día primero, sin depender
  // del locale del navegador). El backend sigue recibiendo ISO yyyy-mm-dd.
  calendarioAbierto = signal<'desde' | 'hasta' | null>(null);
  vistaAnio = signal(new Date().getFullYear());
  vistaMes = signal(new Date().getMonth());
  readonly diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  nombreMesVista = computed(() => {
    const n = new Date(this.vistaAnio(), this.vistaMes(), 1)
      .toLocaleString('es', { month: 'long' });
    return n.charAt(0).toUpperCase() + n.slice(1);
  });

  diasVista = computed(() => {
    const anio = this.vistaAnio();
    const mes = this.vistaMes();
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

  private aYYYYMMDD(f: Date): string {
    const m = String(f.getMonth() + 1).padStart(2, '0');
    const d = String(f.getDate()).padStart(2, '0');
    return `${f.getFullYear()}-${m}-${d}`;
  }

  /** ISO yyyy-mm-dd → dd/mm/aaaa para mostrar en el input de solo lectura. */
  mostrarFecha(iso: string): string {
    if (!iso) return '';
    const [a, m, d] = iso.split('-');
    return `${d}/${m}/${a}`;
  }

  abrirCalendario(cual: 'desde' | 'hasta') {
    const actual = this.filtros[cual]() || this.aYYYYMMDD(new Date());
    const base = new Date(actual + 'T12:00:00');
    this.vistaAnio.set(base.getFullYear());
    this.vistaMes.set(base.getMonth());
    this.calendarioAbierto.set(cual);
  }

  cerrarCalendario() {
    this.calendarioAbierto.set(null);
  }

  cambiarMesCalendario(delta: number) {
    const total = this.vistaAnio() * 12 + this.vistaMes() + delta;
    this.vistaAnio.set(Math.floor(total / 12));
    this.vistaMes.set(((total % 12) + 12) % 12);
  }

  elegirDiaCalendario(fechaISO: string) {
    const cual = this.calendarioAbierto();
    if (!cual) return;
    this.actualizarFiltro(cual, fechaISO);
    this.cerrarCalendario();
  }

  limpiarFecha(cual: 'desde' | 'hasta') {
    this.actualizarFiltro(cual, '');
    this.cerrarCalendario();
  }

  pagina = signal(1);
  total = signal(0);
  totalPaginas = signal(1);
  errorRango = signal('');

  rangoInvalido = computed(() => {
    const d = this.filtros.desde();
    const h = this.filtros.hasta();
    return d !== '' && h !== '' && d > h;
  });

  private debounceTimer: ReturnType<typeof setTimeout> | undefined;
  private refreshTimer: ReturnType<typeof setInterval> | undefined;
  private cargando = false;

  ngOnInit(): void {
    this.cargarNotificaciones();
  };

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  };

  cargarNotificaciones() {
    if (this.rangoInvalido()) {
      this.errorRango.set('"Desde" no puede ser posterior a "Hasta".');
      return;
    }
    this.errorRango.set('');
    if (this.cargando) return;
    this.cargando = true;
    this.ns.getNotificaciones({
      desde: this.filtros.desde() || undefined,
      hasta: this.filtros.hasta() || undefined,
      usuario: this.filtros.usuario().trim() || undefined,
      tipo: this.filtros.tipo() || undefined,
      motivo: this.filtros.motivo().trim() || undefined,
      telefono: this.filtros.telefono().trim() || undefined,
      mensaje: this.filtros.mensaje().trim() || undefined,
      estado: this.filtros.estado() || undefined,
      orden: this.orden() || undefined,
      direccion: this.orden() ? this.direccion() : undefined,
      pagina: this.pagina(),
    }).subscribe({
      next: (resp: NotificacionPagina) => {
        this.cargando = false;
        const total = resp.total ?? 0;
        this.total.set(total);
        this.totalPaginas.set(Math.max(1, Math.ceil(total / this.TAMANIO_PAGINA)));
        this.pagina.set(resp.pagina ?? this.pagina());
        this.ns.limpiarNotificacionesSignal();
        let hayPendientes = false;
        (resp.notificaciones ?? []).forEach((n) => {
          if (n.estado === 'pendiente') hayPendientes = true;
          this.ns.setNotificacionesSignal(n);
        });
        if (hayPendientes) {
          if (!this.refreshTimer) {
            this.refreshTimer = setInterval(() => this.cargarNotificaciones(), 4000);
          }
        } else if (this.refreshTimer) {
          clearInterval(this.refreshTimer);
          this.refreshTimer = undefined;
        }
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      }
    });
  };

  actualizarFiltro(campo: CampoFiltro, valor: string | Event) {
    const v = typeof valor === 'string' ? valor : (valor.target as HTMLInputElement)?.value ?? '';
    this.filtros[campo].set(v);
    this.pagina.set(1);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.cargarNotificaciones(), 400);
  };

  irAPagina(pagina: number) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    const destino = Math.min(Math.max(1, pagina), this.totalPaginas());
    if (destino === this.pagina()) return;
    this.pagina.set(destino);
    this.cargarNotificaciones();
  };

  verTodos() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    (Object.keys(this.filtros) as CampoFiltro[]).forEach((campo) => this.filtros[campo].set(''));
    this.pagina.set(1);
    this.cargarNotificaciones();
  };

  accionOrdenar(campo: CampoOrden) {
    if (this.orden() === campo) {
      this.direccion.set(this.direccion() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orden.set(campo);
      this.direccion.set('asc');
    }
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.pagina.set(1);
    this.cargarNotificaciones();
  };
}