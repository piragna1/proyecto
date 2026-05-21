import { Component } from '@angular/core';
import { NavbarInicialPeluquero } from '../../components/navbar-inicial-peluquero/navbar-inicial-peluquero';
import { ComponenteClientesPeluquero } from '../../components/componente-clientes-peluquero/componente-clientes-peluquero';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-clientes-peluquero',
  imports: [NavbarInicialPeluquero, ComponenteClientesPeluquero, Footer],
  templateUrl: './pagina-clientes-peluquero.html',
  styleUrl: './pagina-clientes-peluquero.css',
})
export class PaginaClientesPeluquero { }
