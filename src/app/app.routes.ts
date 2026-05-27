import { Routes } from '@angular/router';
import { PaginaInicial } from './pages/pagina-inicial/pagina-inicial';
import { PaginaLogin } from './pages/pagina-login/pagina-login';
import { PaginaRegistro } from './pages/pagina-registro/pagina-registro';
import { PaginaAdmin } from './pages/pagina-admin/pagina-admin';
import { PaginaHome } from './pages/pagina-home/pagina-home';
import { PaginaNuevoTurno } from './pages/pagina-nuevo-turno/pagina-nuevo-turno';
import { PaginaMisTurnos } from './pages/pagina-mis-turnos/pagina-mis-turnos';
import { PaginaInicialAdministrador } from './pages/pagina-inicial-administrador/pagina-inicial-administrador';
import { PaginaUsuariosAdministrador } from './pages/pagina-usuarios-administrador/pagina-usuarios-administrador';
import { PaginaClientesAdministrador } from './pages/pagina-clientes-administrador/pagina-clientes-administrador';
import { PaginaPeluquerosAdministrador } from './pages/pagina-peluqueros-administrador/pagina-peluqueros-administrador';
import { PaginaAdministradoresAdministrador } from './pages/pagina-administradores-administrador/pagina-administradores-administrador';
import { PaginaTurnosAdministrador } from './pages/pagina-turnos-administrador/pagina-turnos-administrador';
import { PaginaServiciosAdministrador } from './pages/pagina-servicios-administrador/pagina-servicios-administrador';
import { PaginaAltaPeluquero } from './pages/pagina-alta-peluquero/pagina-alta-peluquero';
import { PaginaAltaAdministrador } from './pages/pagina-alta-administrador/pagina-alta-administrador';
import { PaginaAltaServicio } from './pages/pagina-alta-servicio/pagina-alta-servicio';
import { PaginaInicialPeluquero } from './pages/pagina-inicial-peluquero/pagina-inicial-peluquero';
import { PaginaClientesPeluquero } from './pages/pagina-clientes-peluquero/pagina-clientes-peluquero';
import { PaginaTurnosPeluquero } from './pages/pagina-turnos-peluquero/pagina-turnos-peluquero';
import { PaginaServiciosPeluquero } from './pages/pagina-servicios-peluquero/pagina-servicios-peluquero';
import { authGuard } from './guards/authGuard';
import { guestGuard } from './guards/guestGuard';
import { adminGuard } from './guards/adminGuard';
import { superAdminGuard } from './guards/superAdminGuard';
import { peluqueroGuard } from './guards/peluqueroGuard';

export const routes: Routes = [
    {
        path: '', component: PaginaInicial, canActivate: [guestGuard]
    },
    {
        path: 'login', component: PaginaLogin, canActivate: [guestGuard]
    },
    {
        path: 'registro', component: PaginaRegistro, canActivate: [guestGuard]
    },
    {
        path: 'admin', component: PaginaAdmin, canActivate: [guestGuard]
    },
    {
        path: 'home', component: PaginaHome, canActivate: [authGuard]
    },
    {
        path: 'nuevo-turno', component: PaginaNuevoTurno, canActivate: [authGuard]
    },
    {
        path: 'mis-turnos', component: PaginaMisTurnos, canActivate: [authGuard]
    },
    {
        path: 'home-admin', component: PaginaInicialAdministrador, canActivate: [adminGuard]
    },
    {
        path: 'usuarios-admin', component: PaginaUsuariosAdministrador, canActivate: [adminGuard]
    },
    {
        path: 'clientes-admin', component: PaginaClientesAdministrador, canActivate: [adminGuard]
    },
    {
        path: 'peluqueros-admin', component: PaginaPeluquerosAdministrador, canActivate: [adminGuard]
    },
    {
        path: 'administradores-admin', component: PaginaAdministradoresAdministrador, canActivate: [adminGuard]
    },
    {
        path: 'turnos-admin', component: PaginaTurnosAdministrador, canActivate: [adminGuard]
    },
    {
        path: 'servicios-admin', component: PaginaServiciosAdministrador, canActivate: [adminGuard]
    },
    {
        path: 'alta-peluquero', component: PaginaAltaPeluquero, canActivate: [adminGuard]
    },
    {
        path: 'alta-administrador', component: PaginaAltaAdministrador, canActivate: [superAdminGuard]
    },
    {
        path: 'alta-servicio', component: PaginaAltaServicio, canActivate: [adminGuard]
    },
    {
        path: 'home-peluquero', component: PaginaInicialPeluquero, canActivate: [peluqueroGuard]
    },
    {
        path: 'clientes-peluquero', component: PaginaClientesPeluquero, canActivate: [peluqueroGuard]
    },
    {
        path: 'turnos-peluquero', component: PaginaTurnosPeluquero, canActivate: [peluqueroGuard]
    },
    {
        path: 'servicios-peluquero', component: PaginaServiciosPeluquero, canActivate: [peluqueroGuard]
    },
    {
        path: '**', redirectTo: ''
    }
];
