import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteTurnosAdministrador } from '../../components/componente-turnos-administrador/componente-turnos-administrador';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-turnos-administrador',
  imports: [NavbarInicialAdmin, ComponenteTurnosAdministrador, Footer],
  templateUrl: './pagina-turnos-administrador.html',
  styleUrl: './pagina-turnos-administrador.css',
})
export class PaginaTurnosAdministrador { }
