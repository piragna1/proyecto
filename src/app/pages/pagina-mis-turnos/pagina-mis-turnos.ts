import { Component } from '@angular/core';
import { NavbarUsuarioMisTurnos } from '../../components/navbar-usuario-mis-turnos/navbar-usuario-mis-turnos';
import { ComponenteMisTurnos } from '../../components/componente-mis-turnos/componente-mis-turnos';
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-pagina-mis-turnos',
  imports: [NavbarUsuarioMisTurnos, ComponenteMisTurnos, Footer],
  templateUrl: './pagina-mis-turnos.html',
  styleUrl: './pagina-mis-turnos.css',
})
export class PaginaMisTurnos { }
