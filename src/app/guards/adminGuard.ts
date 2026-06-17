import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth/services/auth-service";

export function adminGuard() {
    console.log('adminGuard ejecutado');
    const authService = inject(AuthService);
    const router: Router = inject(Router);

    if (!authService.esTokenValido()) return false;

    const rol = authService.obtenerRolUsuario();

    switch(rol){
        case 'administrador':
            return true;
        case 'cliente':
            router.navigateByUrl('/home');
            return false;
        case 'peluquero':
            router.navigateByUrl('/home-peluquero');
            return false;
        default:
            return false;
    }
    
}