import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteEditarClienteAdministrador } from '../../components/componente-editar-cliente-administrador/componente-editar-cliente-administrador';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-editar-cliente-administrador',
  imports: [NavbarInicialAdmin, ComponenteEditarClienteAdministrador, Footer],
  templateUrl: './pagina-editar-cliente-administrador.html',
  styleUrl: './pagina-editar-cliente-administrador.css',
})
export class PaginaEditarClienteAdministrador { }
