import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth/services/auth-service";

export function mostradorGuard() {
    const authService = inject(AuthService);
    const router: Router = inject(Router);

    if (!authService.esTokenValido()) {
        authService.cerrarSesion();
        router.navigateByUrl('/');
        return false;
    }

    const rol = authService.obtenerRolUsuario();

    switch (rol) {
        case 'cliente':
            router.navigateByUrl('/home')
            return false;
        case 'administrador':
        case 'peluquero':
            return true;
        default:
            return false;
    };
};