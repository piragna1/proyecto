import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteServiciosAdministrador } from '../../components/componente-servicios-administrador/componente-servicios-administrador';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-servicios-administrador',
  imports: [NavbarInicialAdmin, ComponenteServiciosAdministrador, Footer],
  templateUrl: './pagina-servicios-administrador.html',
  styleUrl: './pagina-servicios-administrador.css',
})
export class PaginaServiciosAdministrador { }
