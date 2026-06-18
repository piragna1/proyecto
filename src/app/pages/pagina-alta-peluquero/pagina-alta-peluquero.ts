import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteAltaPeluquero } from '../../components/componente-alta-peluquero/componente-alta-peluquero';

@Component({
  selector: 'app-pagina-alta-peluquero',
  imports: [NavbarInicialAdmin, ComponenteAltaPeluquero],
  templateUrl: './pagina-alta-peluquero.html',
  styleUrl: './pagina-alta-peluquero.css',
})
export class PaginaAltaPeluquero { }
