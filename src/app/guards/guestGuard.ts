import { inject } from "@angular/core";
import { Router } from "@angular/router";

export function guestGuard() {
    console.log('guestGuard ejecutado');
    const usuario = localStorage.getItem('usuario');
    const router: Router = inject(Router);
    if (!usuario) {
        return true;
    }
    try {
        const usuarioLogueado = JSON.parse(usuario);
        if (usuarioLogueado.rol === 'administrador') {
            router.navigateByUrl('/home-admin');
        } else if (usuarioLogueado.rol === 'peluquero') {
            router.navigateByUrl('/home-peluquero');
        } else {
            router.navigateByUrl('/home');
        }
    } catch (e) {
        console.log('Error parsing usuario:', e);
        router.navigateByUrl('/');
    }
    return false;
}