import { Component } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { ComponenteAltaServicio } from '../../components/componente-alta-servicio/componente-alta-servicio';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-alta-servicio',
  imports: [NavbarInicialAdmin, ComponenteAltaServicio, Footer],
  templateUrl: './pagina-alta-servicio.html',
  styleUrl: './pagina-alta-servicio.css',
})
export class PaginaAltaServicio { }
