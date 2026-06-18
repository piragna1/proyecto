import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponentePeluquerosAdministrador } from '../../components/componente-peluqueros-administrador/componente-peluqueros-administrador';

@Component({
  selector: 'app-pagina-peluqueros-administrador',
  imports: [NavbarInicialAdmin, ComponentePeluquerosAdministrador],
  templateUrl: './pagina-peluqueros-administrador.html',
  styleUrl: './pagina-peluqueros-administrador.css',
})
export class PaginaPeluquerosAdministrador { }
