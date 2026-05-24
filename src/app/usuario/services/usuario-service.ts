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
  constructor(private http: HttpClient) {}

  getUsuariosSignal() {
    return this.usuarios;
  }

  setUserSignal(usuario: Usuario) {
    this.usuarios.update((actuales) => {
      if (actuales.find((u) => u.id === usuario.id)) return actuales;
      return [...actuales, usuario];
    });
  }

  postUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, usuario);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }
}
