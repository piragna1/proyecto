import { inject } from "@angular/core";
import { AuthService } from "../auth/services/auth-service";
import { Router } from "@angular/router";

export function authGuard() {
    console.log('authGuard ejecutado');
    const authService = inject(AuthService);
    const router: Router = inject(Router);

    if (!authService.esTokenValido()) return false;

    const rol = authService.obtenerRolUsuario();

    switch(rol){
        case 'cliente':
            return true;
        case 'administrador':
            router.navigateByUrl('/home-admin')
            return false;
        case 'peluquero':
            router.navigateByUrl('/home-peluquero')
            return false;
        default:
            return false;
    };
};