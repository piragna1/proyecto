import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteEditarPeluqueroAdministrador } from '../../components/componente-editar-peluquero-administrador/componente-editar-peluquero-administrador';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-editar-peluquero-administrador',
  imports: [NavbarInicialAdmin, ComponenteEditarPeluqueroAdministrador, Footer],
  templateUrl: './pagina-editar-peluquero-administrador.html',
  styleUrl: './pagina-editar-peluquero-administrador.css',
})
export class PaginaEditarPeluqueroAdministrador { }
