import { Component, computed, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { PagoService } from '../../pago/services/pago-service';

type CampoFiltro = 'desde' | 'hasta' | 'cliente' | 'telefono' | 'servicio' | 'horario' | 'metodo' | 'montoMin' | 'montoMax';
type CampoFecha = 'desde' | 'hasta';

@Component({
  selector: 'app-componente-pagos-administrador',
  imports: [RouterLink, DatePipe],
  templateUrl: './componente-pagos-administrador.html',
  styleUrl: './componente-pagos-administrador.css',
})
export class ComponentePagosAdministrador implements OnInit, OnDestroy {
  ps: PagoService = inject(PagoService);
  pagos = this.ps.getPagosSignal();
  total: number = 0;

  filtros: Record<CampoFiltro, WritableSignal<string>> = {
    desde: signal(''),
    hasta: signal(''),
    cliente: signal(''),
    telefono: signal(''),
    servicio: signal(''),
    horario: signal(''),
    metodo: signal(''),
    montoMin: signal(''),
    montoMax: signal(''),
  };

  errorRango = signal('');

  rangoInvalido = computed(() => {
    const d = this.filtros.desde();
    const h = this.filtros.hasta();
    return d !== '' && h !== '' && d > h;
  });

  // Calendario popup propio para Fecha/Desde/Hasta (día primero, sin
  // depender del locale del navegador). El backend recibe ISO yyyy-mm-dd.
  calendarioAbierto = signal<CampoFecha | null>(null);
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

  abrirCalendario(cual: CampoFecha) {
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

  limpiarFecha(cual: CampoFecha) {
    this.actualizarFiltro(cual, '');
    this.cerrarCalendario();
  }

  private debounceTimer: ReturnType<typeof setTimeout> | undefined;

  ngOnInit(): void {
    this.cargarPagos();
  };

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  };

  cargarPagos() {
    if (this.rangoInvalido()) {
      this.errorRango.set('"Desde" no puede ser posterior a "Hasta".');
      return;
    }
    this.errorRango.set('');
    this.ps.getPagos({
      desde: this.filtros.desde() || undefined,
      hasta: this.filtros.hasta() || undefined,
      cliente: this.filtros.cliente().trim() || undefined,
      telefono: this.filtros.telefono().trim() || undefined,
      servicio: this.filtros.servicio().trim() || undefined,
      horario: this.filtros.horario().trim() || undefined,
      metodo: this.filtros.metodo() || undefined,
      montoMin: this.filtros.montoMin() || undefined,
      montoMax: this.filtros.montoMax() || undefined,
    }).subscribe({
      next: (r) => {
        this.total = r.total;
        this.ps.limpiarPagosSignal();
        r.pagos.forEach((p) => this.ps.setPagosSignal(p));
      },
      error: (err) => {
        console.log(err);
      }
    });
  };

  actualizarFiltro(campo: CampoFiltro, valor: string | Event) {
    const v = typeof valor === 'string' ? valor : (valor.target as HTMLInputElement)?.value ?? '';
    this.filtros[campo].set(v);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.cargarPagos(), 400);
  };

  verTodos() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    (Object.keys(this.filtros) as CampoFiltro[]).forEach((campo) => this.filtros[campo].set(''));
    this.cargarPagos();
  };
}