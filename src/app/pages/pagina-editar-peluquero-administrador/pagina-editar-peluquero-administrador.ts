import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteEditarPeluqueroAdministrador } from '../../components/componente-editar-peluquero-administrador/componente-editar-peluquero-administrador';

@Component({
  selector: 'app-pagina-editar-peluquero-administrador',
  imports: [NavbarInicialAdmin, ComponenteEditarPeluqueroAdministrador],
  templateUrl: './pagina-editar-peluquero-administrador.html',
  styleUrl: './pagina-editar-peluquero-administrador.css',
})
export class PaginaEditarPeluqueroAdministrador { }
