import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth/services/auth-service";

export function superAdminGuard() {
    console.log('superAdminGuard ejecutado');
        const authService = inject(AuthService);
        const router: Router = inject(Router);
    
        if (!authService.esTokenValido()) return false;
    
        const rol = authService.obtenerRolUsuario();
    
        switch(rol){
            case 'cliente':
                router.navigateByUrl('/home')
                return false;
            case 'administrador':
                if (authService.esSuperAdmin()) return true;
                router.navigateByUrl('/home-admin')
                return false;
            case 'peluquero':
                router.navigateByUrl('/home-peluquero')
                return false;
            default:
                return false;
        };
}