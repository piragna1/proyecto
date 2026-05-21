import { Routes } from '@angular/router';
import { PaginaInicial } from './pages/pagina-inicial/pagina-inicial';
import { PaginaLogin } from './pages/pagina-login/pagina-login';
import { PaginaRegistro } from './pages/pagina-registro/pagina-registro';
import { PaginaAdmin } from './pages/pagina-admin/pagina-admin';
import { PaginaHome } from './pages/pagina-home/pagina-home';
import { PaginaNuevoTurno } from './pages/pagina-nuevo-turno/pagina-nuevo-turno';

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
        path: '**', redirectTo: ''
    }
];
