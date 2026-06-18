import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteModificarTurnoAdministrador } from '../../components/componente-modificar-turno-administrador/componente-modificar-turno-administrador';

@Component({
  selector: 'app-pagina-modificar-turno-administrador',
  imports: [NavbarInicialAdmin, ComponenteModificarTurnoAdministrador],
  templateUrl: './pagina-modificar-turno-administrador.html',
  styleUrl: './pagina-modificar-turno-administrador.css',
})
export class PaginaModificarTurnoAdministrador { }
