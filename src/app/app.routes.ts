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

export const routes: Routes = [
    {
        path: '', component: PaginaInicial
    },
    {
        path: 'login', component: PaginaLogin
    },
    {
        path: 'registro', component: PaginaRegistro
    },
    {
        path: 'admin', component: PaginaAdmin
    },
    {
        path: 'home', component: PaginaHome
    },
    {
        path: 'nuevo-turno', component: PaginaNuevoTurno
    },
    {
        path: 'mis-turnos', component: PaginaMisTurnos
    },
    {
        path: 'home-admin', component: PaginaInicialAdministrador
    },
    {
        path: 'usuarios-admin', component: PaginaUsuariosAdministrador
    },
    {
        path: 'clientes-admin', component: PaginaClientesAdministrador
    },
    {
        path: 'peluqueros-admin', component: PaginaPeluquerosAdministrador
    },
    {
        path: 'administradores-admin', component: PaginaAdministradoresAdministrador
    },
    {
        path: 'turnos-admin', component: PaginaTurnosAdministrador
    },
    {
        path: 'servicios-admin', component: PaginaServiciosAdministrador
    },
    {
        path: 'alta-peluquero', component: PaginaAltaPeluquero
    },
    {
        path: 'alta-administrador', component: PaginaAltaAdministrador
    },
    {
        path: 'alta-servicio', component: PaginaAltaServicio
    },
    {
        path: 'home-peluquero', component: PaginaInicialPeluquero
    },
    {
        path: '**', redirectTo: ''
    }
];
