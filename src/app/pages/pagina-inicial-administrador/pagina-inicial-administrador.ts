import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { Footer } from "../../shared/components/footer/footer";
import { ComponenteInicialAdministrador } from '../../components/componente-inicial-administrador/componente-inicial-administrador';

@Component({
  selector: 'app-pagina-inicial-administrador',
  imports: [NavbarInicialAdmin, ComponenteInicialAdministrador, Footer],
  templateUrl: './pagina-inicial-administrador.html',
  styleUrl: './pagina-inicial-administrador.css',
})
export class PaginaInicialAdministrador { }
