import { Injectable, inject } from '@angular/core';
import { ToastService } from './toast-service';
import { MENSAJE_SIN_BACKEND } from '../utils/errorMessages';

// Ventana de silencio para no apilar el mismo aviso cuando varias requests fallan
// por la misma caida, por ejemplo una pantalla que carga datos en paralelo.
const COOLDOWN_MS = 4000;

/**
 * Dueño de la politica de aviso cuando el backend no responde.
 *
 * No decide si la caido es real: eso lo determina el interceptor mirando el status
 * de la respuesta. Este servicio solo evita que el mismo mensaje aparezca varias
 * veces seguidas.
 */
@Injectable({
  providedIn: 'root',
})
export class ServidorCaidoService {
  // inject() en vez de constructor: es el patron que ya usa ToastService, el
  // otro servicio de esta carpeta, y esquiva el falso positivo de no-unused-vars
  // con parameter properties.
  private toasts = inject(ToastService);

  // Arranca en 0 para que la primera llamada siempre supere el cooldown.
  private ultimoAviso = 0;

  /**
   * Muestra el toast de conexion, como maximo uno cada COOLDOWN_MS.
   * Es idempotente dentro de la ventana: si ya hay un aviso reciente no vuelve a mostrar.
   */
  notificar() {
    const ahora = Date.now();
    if (ahora - this.ultimoAviso < COOLDOWN_MS) return;
    this.ultimoAviso = ahora;
    this.toasts.mostrarMensaje(MENSAJE_SIN_BACKEND, true);
  }
}