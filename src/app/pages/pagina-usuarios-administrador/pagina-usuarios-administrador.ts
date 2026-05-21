import { Component } from '@angular/core';
import { NavbarUsuariosAdministrador } from '../../components/navbar-usuarios-administrador/navbar-usuarios-administrador';
import { Footer } from '../../shared/components/footer/footer';
import { ComponenteUsuariosAdministrador } from '../../components/componente-usuarios-administrador/componente-usuarios-administrador';
import { NavbarInicialAdmin } from "../../components/navbar-inicial-admin/navbar-inicial-admin";

@Component({
  selector: 'app-pagina-usuarios-administrador',
  imports: [NavbarUsuariosAdministrador, ComponenteUsuariosAdministrador, Footer, NavbarInicialAdmin],
  templateUrl: './pagina-usuarios-administrador.html',
  styleUrl: './pagina-usuarios-administrador.css',
})
export class PaginaUsuariosAdministrador { }
