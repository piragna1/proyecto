import { Injectable, signal } from '@angular/core';

const DURACION_VISIBLE = 4000;
const DURACION_FADE = 300;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  mensaje = signal('');
  visible = signal(false);
  ocultando = signal(false);
  esError = signal(false);
  mostrarMensaje(mensaje: string, error = false) {
    this.mensaje.set(mensaje);
    this.esError.set(error);
    this.ocultando.set(false);
    this.visible.set(true);
    setTimeout(() => {
      this.ocultando.set(true);
      setTimeout(() => {
        this.visible.set(false);
      }, DURACION_FADE);
    }, DURACION_VISIBLE);
  };
};