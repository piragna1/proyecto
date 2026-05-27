import { inject } from "@angular/core";
import { Router } from "@angular/router";

export function superAdminGuard() {
    console.log('superAdminGuard ejecutado');
    const usuario = localStorage.getItem('usuario');
    const router: Router = inject(Router);
    if (usuario) {
        const usuarioLogueado = JSON.parse(usuario);
        if (usuarioLogueado.superadmin === 1) {
            return true;
        }
        if (usuarioLogueado.rol === 'administrador') {
            router.navigateByUrl('/home-admin');
            return false;
        }
        if (usuarioLogueado.rol === 'peluquero') {
            router.navigateByUrl('/home-peluquero');
            return false;
        }
        router.navigateByUrl('/home');
        return false;
    }
    router.navigate(['/']);
    return false;
}