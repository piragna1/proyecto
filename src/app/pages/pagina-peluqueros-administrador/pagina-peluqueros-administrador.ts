import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponentePeluquerosAdministrador } from '../../components/componente-peluqueros-administrador/componente-peluqueros-administrador';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-peluqueros-administrador',
  imports: [NavbarInicialAdmin, ComponentePeluquerosAdministrador, Footer],
  templateUrl: './pagina-peluqueros-administrador.html',
  styleUrl: './pagina-peluqueros-administrador.css',
})
export class PaginaPeluquerosAdministrador { }
