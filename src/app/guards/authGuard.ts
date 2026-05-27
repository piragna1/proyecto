import { inject } from "@angular/core";
import { AuthService } from "../auth/services/auth-service";
import { Router } from "@angular/router";

export function authGuard() {
    console.log('authGuard ejecutado');
    const authService = inject(AuthService);
    const router: Router = inject(Router);
    if (authService.estoyLogeado && localStorage.getItem('usuario')) {
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (usuarioLogueado.rol === 'cliente') {
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
    }
    router.navigate(['/']);
    return false;
}