import { Component } from '@angular/core';
import { NavbarInicialPeluquero } from '../../components/navbar-inicial-peluquero/navbar-inicial-peluquero';
import { ComponenteTurnosPeluquero } from '../../components/componente-turnos-peluquero/componente-turnos-peluquero';

@Component({
  selector: 'app-pagina-turnos-peluquero',
  imports: [NavbarInicialPeluquero, ComponenteTurnosPeluquero],
  templateUrl: './pagina-turnos-peluquero.html',
  styleUrl: './pagina-turnos-peluquero.css',
})
export class PaginaTurnosPeluquero { }
