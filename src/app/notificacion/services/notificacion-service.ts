import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Notificacion } from '../interface/notificacion.interface';
import { Observable } from 'rxjs';

export interface NotificacionFiltros {
  fecha?: string;
  usuario?: string;
  tipo?: string;
  motivo?: string;
  telefono?: string;
  mensaje?: string;
  estado?: string;
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
  getNotificaciones(filtros?: NotificacionFiltros): Observable<Notificacion[]> {
    let params = new HttpParams();
    if (filtros) {
      (Object.entries(filtros) as [keyof NotificacionFiltros, string | undefined][]).forEach(([clave, valor]) => {
        if (valor !== undefined && valor !== '') {
          params = params.set(clave, valor);
        }
      });
    }
    return this.http.get<Notificacion[]>(this.url, params.keys().length ? { params } : undefined);
  };
}