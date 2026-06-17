import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth/services/auth-service";

export function peluqueroGuard() {
    console.log('peluqueroGuard ejecutado');
        const authService = inject(AuthService);
        const router: Router = inject(Router);
    
        if (!authService.esTokenValido()) return false;
    
        const rol = authService.obtenerRolUsuario();

        console.log('rol', rol);
        
    
        switch(rol){
            case 'cliente':
                router.navigateByUrl('/home')
                return false;
            case 'administrador':
                router.navigateByUrl('/home-admin')
                return false;
            case 'peluquero':
                return true;
            default:
                return false;
        };
};