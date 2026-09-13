import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteNotificacionesAdministrador } from '../../components/componente-notificaciones-administrador/componente-notificaciones-administrador';

@Component({
  selector: 'app-pagina-notificaciones-administrador',
  imports: [NavbarInicialAdmin, ComponenteNotificacionesAdministrador],
  templateUrl: './pagina-notificaciones-administrador.html',
  styleUrl: './pagina-notificaciones-administrador.css',
})
export class PaginaNotificacionesAdministrador { }