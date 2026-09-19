import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { PagoService } from '../../pago/services/pago-service';

type CampoFiltro = 'fecha' | 'cliente' | 'servicio' | 'horario' | 'metodo' | 'montoMin' | 'montoMax';

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
    fecha: signal(''),
    cliente: signal(''),
    servicio: signal(''),
    horario: signal(''),
    metodo: signal(''),
    montoMin: signal(''),
    montoMax: signal(''),
  };

  private debounceTimer: ReturnType<typeof setTimeout> | undefined;

  ngOnInit(): void {
    this.filtros.fecha.set(this.hoy());
    this.cargarPagos();
  };

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  };

  hoy(): string {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  cargarPagos() {
    this.ps.getPagos({
      fecha: this.filtros.fecha() || undefined,
      cliente: this.filtros.cliente().trim() || undefined,
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