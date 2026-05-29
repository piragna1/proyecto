import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { EditarPerfilAdministrador } from '../../components/editar-perfil-administrador/editar-perfil-administrador';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-editar-perfil-administrador',
  imports: [NavbarInicialAdmin, EditarPerfilAdministrador, Footer],
  templateUrl: './pagina-editar-perfil-administrador.html',
  styleUrl: './pagina-editar-perfil-administrador.css',
})
export class PaginaEditarPerfilAdministrador { }
