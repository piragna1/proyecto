import { Component } from '@angular/core';
import { NavbarUsuarioNuevoTurno } from '../../components/navbar-usuario-nuevo-turno/navbar-usuario-nuevo-turno';
import { ComponenteNuevoTurno } from '../../components/componente-nuevo-turno/componente-nuevo-turno';
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-pagina-nuevo-turno',
  imports: [NavbarUsuarioNuevoTurno, ComponenteNuevoTurno, Footer],
  templateUrl: './pagina-nuevo-turno.html',
  styleUrl: './pagina-nuevo-turno.css',
})
export class PaginaNuevoTurno { }
