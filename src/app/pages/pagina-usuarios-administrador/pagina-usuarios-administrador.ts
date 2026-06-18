import { Component } from '@angular/core';
import { ComponenteUsuariosAdministrador } from '../../components/componente-usuarios-administrador/componente-usuarios-administrador';
import { NavbarInicialAdmin } from "../../components/navbar-inicial-admin/navbar-inicial-admin";

@Component({
  selector: 'app-pagina-usuarios-administrador',
  imports: [ComponenteUsuariosAdministrador, NavbarInicialAdmin],
  templateUrl: './pagina-usuarios-administrador.html',
  styleUrl: './pagina-usuarios-administrador.css',
})
export class PaginaUsuariosAdministrador { }
