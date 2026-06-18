import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteClientesAdministrador } from '../../components/componente-clientes-administrador/componente-clientes-administrador';

@Component({
  selector: 'app-pagina-clientes-administrador',
  imports: [NavbarInicialAdmin, ComponenteClientesAdministrador],
  templateUrl: './pagina-clientes-administrador.html',
  styleUrl: './pagina-clientes-administrador.css',
})
export class PaginaClientesAdministrador { }
