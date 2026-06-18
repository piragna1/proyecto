import { Component } from '@angular/core';
import { NavbarInicialPeluquero } from '../../components/navbar-inicial-peluquero/navbar-inicial-peluquero';
import { ComponenteInicialPeluquero } from '../../components/componente-inicial-peluquero/componente-inicial-peluquero';

@Component({
  selector: 'app-pagina-inicial-peluquero',
  imports: [NavbarInicialPeluquero, ComponenteInicialPeluquero],
  templateUrl: './pagina-inicial-peluquero.html',
  styleUrl: './pagina-inicial-peluquero.css',
})
export class PaginaInicialPeluquero { }
