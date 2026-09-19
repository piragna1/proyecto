import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pago, PagosFiltros, PagosResponse } from '../interface/pago.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  url: string = 'http://localhost:3000/pagos';
  pagos = signal<Pago[]>([]);
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }
  getPagosSignal() {
    return this.pagos;
  };
  setPagosSignal(pago: Pago) {
    this.pagos.update((actuales) => {
      if (actuales.find((p) => p.id === pago.id)) return actuales;
      return [...actuales, pago];
    });
  };
  limpiarPagosSignal() {
    this.pagos.set([]);
  };
  getPagos(filtros?: PagosFiltros): Observable<PagosResponse> {
    let params = new HttpParams();
    if (filtros) {
      (Object.entries(filtros) as [keyof PagosFiltros, string | undefined][]).forEach(([clave, valor]) => {
        if (valor !== undefined && valor !== '') {
          params = params.set(clave, valor);
        }
      });
    }
    return this.http.get<PagosResponse>(this.url, params.keys().length ? { params } : undefined);
  };
  postPago(payload: { idTurno: string; metodo: string; monto: number }): Observable<Pago> {
    return this.http.post<Pago>(this.url, payload);
  };
}