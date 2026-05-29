import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteEditarServicioAdministrador } from '../../components/componente-editar-servicio-administrador/componente-editar-servicio-administrador';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-editar-servicio-administrador',
  imports: [NavbarInicialAdmin, ComponenteEditarServicioAdministrador, Footer],
  templateUrl: './pagina-editar-servicio-administrador.html',
  styleUrl: './pagina-editar-servicio-administrador.css',
})
export class PaginaEditarServicioAdministrador { }
