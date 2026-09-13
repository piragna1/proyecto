import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notificacion } from '../interface/notificacion.interface';
import { Observable } from 'rxjs';

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
  getNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.url);
  };
}