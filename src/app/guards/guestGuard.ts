import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth/services/auth-service";

export function guestGuard() {
    console.log('guestGuard ejecutado');
    const authService = inject(AuthService);
    const router:Router = inject(Router);

    const rol = authService.obtenerRolUsuario();
    console.log('rol:', rol);

    switch(rol){
        case 'cliente':
            router.navigateByUrl('/home')
            return false;
        case 'administrador':
            router.navigateByUrl('/home-admin')
            return false;
        case 'peluquero':
            router.navigateByUrl('/home-peluquero')
            return false;
        default:
            return true;
    }
}