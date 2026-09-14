import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponentePagosAdministrador } from '../../components/componente-pagos-administrador/componente-pagos-administrador';

@Component({
  selector: 'app-pagina-pagos-administrador',
  imports: [NavbarInicialAdmin, ComponentePagosAdministrador],
  templateUrl: './pagina-pagos-administrador.html',
  styleUrl: './pagina-pagos-administrador.css',
})
export class PaginaPagosAdministrador { }