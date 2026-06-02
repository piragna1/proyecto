import { inject } from "@angular/core";
import { AuthService } from "../auth/services/auth-service";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";

export function authGuard() {
    console.log('authGuard ejecutado');
    const authService = inject(AuthService);
    const router: Router = inject(Router);

    const tokenRaw = localStorage.getItem('token');
    const token = tokenRaw ? JSON.parse(tokenRaw) : null;
    console.log('token!', token)
    
    if (!token) return false;
    
    try {
        const payload:any = jwtDecode(token);
        console.log('payload',payload);
        if (authService.estoyLogeado && payload) {
            if (payload.rol === 'cliente') {
                return true;
            }
            if (payload.rol === 'administrador') {
                router.navigateByUrl('/home-admin');
                return false;
            }
            if (payload.rol === 'peluquero') {
                router.navigateByUrl('/home-peluquero');
                return false;
            }
        }
    } catch (error) {
        console.log('Error al decodificar el token', error);
        
    }

    return false;
}