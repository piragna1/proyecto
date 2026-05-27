import { inject } from "@angular/core";
import { Router } from "@angular/router";

export function peluqueroGuard() {
    console.log('peluqueroGuard ejecutado');
    const router: Router = inject(Router);
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
        const usuarioLogueado = JSON.parse(usuario);
        if (usuarioLogueado.rol === 'peluquero') {
            return true;
        }
        if (usuarioLogueado.rol === 'administrador') {
            router.navigateByUrl('/home-admin');
            return false;
        }
        router.navigateByUrl('/home');
        return false;
    }
    router.navigate(['/']);
    return false;
}