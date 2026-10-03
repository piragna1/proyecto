/**
 * Ruta de inicio segun el rol del usuario.
 *
 * Fuente unica de verdad: la usan el login (formulario-login.ts) y el guestGuard.
 * Antes cada uno tenia su propio switch duplicado, y tres formularios de login
 * hardcodeaban el destino, asi que /admin y /peluquero quedaban inalcanzables.
 *
 * Ojo: el rol sale del payload del JWT (ver AuthService.obtenerRolUsuario).
 * El token NO incluye `mostrador`; los clientes de mostrador tienen rol 'cliente'
 * y van a /home como cualquier otro cliente.
 */
export function rutaInicioPorRol(rol: string | null | undefined): string | null {
    switch (rol) {
        case 'cliente':
            return '/home';
        case 'administrador':
            return '/home-admin';
        case 'peluquero':
            return '/home-peluquero';
        default:
            return null;
    }
}