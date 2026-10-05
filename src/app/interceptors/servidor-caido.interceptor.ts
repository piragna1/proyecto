// servidor-caido.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ServidorCaidoService } from '../shared/services/servidor-caido-service';

/**
 * Avisa cuando el backend no esta levantado.
 *
 * Va registrado despues de tokenInterceptor para recibir los errores antes que el,
 * y a proposito ignora el 401 para no romper el cierre de sesion que hace ese otro.
 *
 * Cuando detecta la caida igual relanza el error: la peticion se aborta, el `next:`
 * del componente no corre y ninguna accion se completa (no se navega, no se mutan
 * signals, no se muestra un exito falso). El aviso es una capa encima, no un
 * atajo que reemplace el flujo de error de cada componente.
 */
export const servidorCaidoInterceptor: HttpInterceptorFn = (req, next) => {
  const avisos = inject(ServidorCaidoService);

  return next(req).pipe(
    catchError((error: unknown) => {
      // status 0 significa que no llego ninguna respuesta HTTP: el backend no esta
      // levantado, se perdio la conexion o CORS lo bloqueo. Es distinto de cualquier
      // codigo que el servidor haya respondido (400, 401, 409, 5xx), que siguen
      // manejando los componentes con su propio mensaje de negocio.
      if ((error as { status?: number } | null)?.status === 0) {
        avisos.notificar();
      }
      return throwError(() => error);
    })
  );
};