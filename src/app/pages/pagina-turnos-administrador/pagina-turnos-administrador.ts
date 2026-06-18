import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteTurnosAdministrador } from '../../components/componente-turnos-administrador/componente-turnos-administrador';

@Component({
  selector: 'app-pagina-turnos-administrador',
  imports: [NavbarInicialAdmin, ComponenteTurnosAdministrador],
  templateUrl: './pagina-turnos-administrador.html',
  styleUrl: './pagina-turnos-administrador.css',
})
export class PaginaTurnosAdministrador { }
