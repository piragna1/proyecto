import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteAdministradoresAdministrador } from '../../components/componente-administradores-administrador/componente-administradores-administrador';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-administradores-administrador',
  imports: [NavbarInicialAdmin, ComponenteAdministradoresAdministrador, Footer],
  templateUrl: './pagina-administradores-administrador.html',
  styleUrl: './pagina-administradores-administrador.css',
})
export class PaginaAdministradoresAdministrador { }
