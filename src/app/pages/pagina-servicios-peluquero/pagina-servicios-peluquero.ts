import { Component } from '@angular/core';
import { NavbarInicialPeluquero } from '../../components/navbar-inicial-peluquero/navbar-inicial-peluquero';
import { ComponenteServiciosPeluquero } from '../../components/componente-servicios-peluquero/componente-servicios-peluquero';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-servicios-peluquero',
  imports: [NavbarInicialPeluquero, ComponenteServiciosPeluquero, Footer],
  templateUrl: './pagina-servicios-peluquero.html',
  styleUrl: './pagina-servicios-peluquero.css',
})
export class PaginaServiciosPeluquero { }
