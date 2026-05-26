import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Turno } from '../interface/turno.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  url: string = 'http://localhost:3000/turnos';
  turnos = signal<Turno[]>([]);
  constructor(private http: HttpClient) {}
  getTurnosSignal() {
    return this.turnos;
  }
  setTurnosSignal(turno: Turno) {
    this.turnos.update((actuales) => {
      if (actuales.find((t) => t.id === turno.id)) return actuales;
      return [...actuales, turno];
    });
  }
  postTurno(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(this.url, turno);
  }
}
