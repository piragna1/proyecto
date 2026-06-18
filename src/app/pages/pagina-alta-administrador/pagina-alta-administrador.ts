import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteAltaAdministrador } from '../../components/componente-alta-administrador/componente-alta-administrador';

@Component({
  selector: 'app-pagina-alta-administrador',
  imports: [NavbarInicialAdmin, ComponenteAltaAdministrador],
  templateUrl: './pagina-alta-administrador.html',
  styleUrl: './pagina-alta-administrador.css',
})
export class PaginaAltaAdministrador { }
