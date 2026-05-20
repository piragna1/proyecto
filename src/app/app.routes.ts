import { Routes } from '@angular/router';
import { PaginaInicial } from './pages/pagina-inicial/pagina-inicial';

export const routes: Routes = [
    {
        path: '', component: PaginaInicial
    },
    {
        path: '**', redirectTo: ''
    }
];
