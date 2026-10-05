import { HttpErrorResponse } from '@angular/common/http';

// Texto unico para "no hay respuesta HTTP" (status 0). Lo usan este helper y el
// interceptor de servidor-caido, asi que las dos rutas muestran exactamente lo mismo.
// Neutro a proposito: no presupone si el backend esta caido o si fallo la conexion.
export const MENSAJE_SIN_BACKEND = 'Error de conexión con el servidor. Intentá de nuevo más tarde.';

export function mensajeDeError(error: unknown, mensajePorDefecto: string): string {
    const status = (error as HttpErrorResponse | null | undefined)?.status;
    if (status === 0) return MENSAJE_SIN_BACKEND;
    return (error as { error?: { mensaje?: string } } | null | undefined)?.error?.mensaje || mensajePorDefecto;
}