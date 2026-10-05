import { Injectable, signal } from '@angular/core';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

const DURACION_VISIBLE = 4000;
const DURACION_FADE = 300;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  mensaje = signal('');
  visible = signal(false);
  ocultando = signal(false);
  tipo = signal<ToastType>('info');

  // New API with toast types
  mostrarMensaje(mensaje: string, tipo: ToastType | boolean = 'info') {
    const toastTipo: ToastType = typeof tipo === 'boolean' ? (tipo ? 'error' : 'info') : tipo;
    this.mensaje.set(mensaje);
    this.tipo.set(toastTipo);
    this.ocultando.set(false);
    this.visible.set(true);
    setTimeout(() => {
      this.ocultando.set(true);
      setTimeout(() => {
        this.visible.set(false);
      }, DURACION_FADE);
    }, DURACION_VISIBLE);
  }

  // Convenience methods
  info(mensaje: string) { this.mostrarMensaje(mensaje, 'info'); }
  success(mensaje: string) { this.mostrarMensaje(mensaje, 'success'); }
  warning(mensaje: string) { this.mostrarMensaje(mensaje, 'warning'); }
  error(mensaje: string) { this.mostrarMensaje(mensaje, 'error'); }

  cerrar() {
    this.ocultando.set(true);
    setTimeout(() => {
      this.visible.set(false);
    }, DURACION_FADE);
  }
}