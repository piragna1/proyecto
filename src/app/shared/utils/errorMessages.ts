import { HttpErrorResponse } from '@angular/common/http';

export const MENSAJE_SIN_BACKEND = 'Error interno en el servidor. Intentá de nuevo más tarde.';

export function mensajeDeError(error: unknown, mensajePorDefecto: string): string {
    const status = (error as HttpErrorResponse | null | undefined)?.status;
    if (status === 0) return MENSAJE_SIN_BACKEND;
    return (error as { error?: { mensaje?: string } } | null | undefined)?.error?.mensaje || mensajePorDefecto;
}