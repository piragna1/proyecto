import { HttpClient } from '@angular/common/http';
import { Injectable, signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../interface/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  url: string = 'http://localhost:3000/usuarios';
  usuarios = signal<Usuario[]>([]);
  peluqueros = signal<Usuario[]>([]);
  administradores = signal<Usuario[]>([]);
  constructor(private http: HttpClient) { };

  getUsuariosSignal() {
    return this.usuarios;
  };

  setUserSignal(usuario: Usuario) {
    this.usuarios.update((actuales) => {
      if (actuales.find((u) => u.id === usuario.id)) return actuales;
      return [...actuales, usuario];
    });
  };

  getPeluquerosSignal() { return this.peluqueros };
  setPeluquerosSignal(peluquero: Usuario) {
    this.peluqueros.update((actuales) => {
      if (actuales.find((u) => u.id === peluquero.id)) return actuales;
      return [...actuales, peluquero];
    });
  }
  getAdministradoresSignal() { return this.administradores; };
  setAdministradoresSignal(administrador: Usuario) {
    this.administradores.update((actuales) => {
      if (actuales.find((a) => a.id === administrador.id)) return actuales
      return [...actuales, administrador];
    })
  }


  postUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, usuario);
  };

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  };

  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(this.url + '/' + id);
  };

};
