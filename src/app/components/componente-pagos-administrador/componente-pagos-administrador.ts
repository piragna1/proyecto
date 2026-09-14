import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { PagoService } from '../../pago/services/pago-service';

@Component({
  selector: 'app-componente-pagos-administrador',
  imports: [RouterLink, DatePipe],
  templateUrl: './componente-pagos-administrador.html',
  styleUrl: './componente-pagos-administrador.css',
})
export class ComponentePagosAdministrador implements OnInit {
  ps: PagoService = inject(PagoService);
  pagos = this.ps.getPagosSignal();
  total: number = 0;
  fecha: string = '';
  ngOnInit(): void {
    this.fecha = this.hoy();
    this.cargarPagos(this.fecha);
  };

  hoy(): string {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  cargarPagos(fecha?: string) {
    this.ps.getPagos(fecha || undefined).subscribe({
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

  filtrarPorDia(event: any) {
    const input = event.target;
    this.fecha = input.value;
    this.cargarPagos(this.fecha || undefined);
  };

  verTodos() {
    this.fecha = '';
    this.cargarPagos();
  };
}