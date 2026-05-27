import { inject } from "@angular/core";
import { Router } from "@angular/router";

export function adminGuard() {
    console.log('adminGuard ejecutado');
    const usuario = localStorage.getItem('usuario');
    const router: Router = inject(Router);
    if (usuario) {
        const usuarioLogueado = JSON.parse(usuario);
        if (usuarioLogueado.rol === 'administrador') {
            return true;
        }
        if (usuarioLogueado.rol === 'peluquero') {
            router.navigateByUrl('/home-peluquero');
            return false;
        }
        router.navigateByUrl('/home');
        return false;
    }
    router.navigateByUrl('/');
    return false;
}