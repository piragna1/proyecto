import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  mensaje = signal('');
  visible = signal(false);
  ocultando = signal(false);
  mostrarMensaje(mensaje: string) {
    this.mensaje.set(mensaje);
    this.ocultando.set(false);
    this.visible.set(true);
    setTimeout(() => {
      this.ocultando.set(true);
      setTimeout(() => {
        this.visible.set(false);
      }, 300);
    }, 3000);
  };
};