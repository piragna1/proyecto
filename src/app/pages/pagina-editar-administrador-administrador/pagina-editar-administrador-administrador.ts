import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteEditarAdministradorAdministrador } from '../../components/componente-editar-administrador-administrador/componente-editar-administrador-administrador';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-editar-administrador-administrador',
  imports: [NavbarInicialAdmin, ComponenteEditarAdministradorAdministrador, Footer],
  templateUrl: './pagina-editar-administrador-administrador.html',
  styleUrl: './pagina-editar-administrador-administrador.css',
})
export class PaginaEditarAdministradorAdministrador { }
