import { Injectable, signal } from '@angular/core';
import { Servicio } from '../interface/servicio.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  url: string = 'http://localhost:3000/servicios';
  servicios = signal<Servicio[]>([]);
  constructor(private http: HttpClient) { }
  getServiciosSignal() {
    return this.servicios;
  }
  setServiciosSignal(servicio: Servicio) {
    this.servicios.update((actuales) => {
      if (actuales.find((s) => s.id === servicio.id)) return actuales;
      return [...actuales, servicio];
    });
  }
  removerServicio(id: string | null) {
    this.servicios.update((actuales) => {
      return actuales.filter((t) => t.id !== id);
    });
  };
  limpiarServiciosSignal() {
    this.servicios.set([]);
  }

  postServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.url, servicio);
  }

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.url);
  }

  getServicioById(id: string | null): Observable<Servicio> {
    return this.http.get<Servicio>(this.url + '/' + id);
  }

  putServicio(s: Servicio, id: string | null): Observable<Servicio> {
    return this.http.put<Servicio>(this.url + '/' + id, s);
  }

  deleteServicio(id: string | undefined): Observable<Servicio> {
    return this.http.delete<Servicio>(this.url + '/' + id);
  }
}
