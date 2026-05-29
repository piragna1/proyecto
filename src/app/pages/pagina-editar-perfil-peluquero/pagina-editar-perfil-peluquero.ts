import { Component } from '@angular/core';
import { NavbarInicialPeluquero } from '../../components/navbar-inicial-peluquero/navbar-inicial-peluquero';
import { EditarPerfilPeluquero } from '../../components/editar-perfil-peluquero/editar-perfil-peluquero';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-editar-perfil-peluquero',
  imports: [NavbarInicialPeluquero, EditarPerfilPeluquero, Footer],
  templateUrl: './pagina-editar-perfil-peluquero.html',
  styleUrl: './pagina-editar-perfil-peluquero.css',
})
export class PaginaEditarPerfilPeluquero { }
