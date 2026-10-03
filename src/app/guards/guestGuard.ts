import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth/services/auth-service";
import { rutaInicioPorRol } from "../shared/utils/rutasPorRol";

export function guestGuard() {
    const authService = inject(AuthService);
    const router:Router = inject(Router);

    if (!authService.esTokenValido()){
        authService.cerrarSesion();
        return true;
    }

    // Si ya hay sesion iniciada, cada rol va a su home.
    const ruta = rutaInicioPorRol(authService.obtenerRolUsuario());
    if (ruta) {
        router.navigateByUrl(ruta);
        return false;
    }

    return true;
}