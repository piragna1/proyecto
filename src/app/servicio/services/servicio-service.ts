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
  constructor(private http: HttpClient) {}
  getServiciosSignal() {
    return this.servicios;
  }
  setServiciosSignal(servicio: Servicio) {
    this.servicios.update((actuales) => {
      if (actuales.find((s) => s.id === servicio.id)) return actuales;
      return [...actuales, servicio];
    });
  }
  postServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.url, servicio);
  }

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.url);
  }
}
