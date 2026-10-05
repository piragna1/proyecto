import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Notificacion, NotificacionPagina } from '../interface/notificacion.interface';
import { Observable } from 'rxjs';

export interface NotificacionFiltros {
  desde?: string;
  hasta?: string;
  usuario?: string;
  tipo?: string;
  motivo?: string;
  telefono?: string;
  mensaje?: string;
  estado?: string;
  orden?: string;
  direccion?: string;
  pagina?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  url: string = 'http://localhost:3000/notificaciones';
  notificaciones = signal<Notificacion[]>([]);
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }
  getNotificacionesSignal() {
    return this.notificaciones;
  };
  setNotificacionesSignal(notificacion: Notificacion) {
    this.notificaciones.update((actuales) => {
      if (actuales.find((n) => n.id === notificacion.id)) return actuales;
      return [...actuales, notificacion];
    });
  };
  limpiarNotificacionesSignal() {
    this.notificaciones.set([]);
  };
  getNotificaciones(filtros?: NotificacionFiltros): Observable<NotificacionPagina> {
    let params = new HttpParams();
    if (filtros) {
      const entradas = Object.entries(filtros) as [keyof NotificacionFiltros, NotificacionFiltros[keyof NotificacionFiltros]][];
      entradas.forEach(([clave, valor]) => {
        if (valor !== undefined && valor !== '') {
          params = params.set(clave, valor);
        }
      });
    }
    return this.http.get<NotificacionPagina>(this.url, params.keys().length ? { params } : undefined);
  };
}