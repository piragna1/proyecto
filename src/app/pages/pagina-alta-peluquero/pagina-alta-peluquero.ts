import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteAltaPeluquero } from '../../components/componente-alta-peluquero/componente-alta-peluquero';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-alta-peluquero',
  imports: [NavbarInicialAdmin, ComponenteAltaPeluquero, Footer],
  templateUrl: './pagina-alta-peluquero.html',
  styleUrl: './pagina-alta-peluquero.css',
})
export class PaginaAltaPeluquero { }
