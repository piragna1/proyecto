import { Component } from '@angular/core';
import { NavbarInicial } from '../../components/navbar-inicial/navbar-inicial';
import { FormularioLogin } from '../../components/formulario-login/formulario-login';

@Component({
  selector: 'app-pagina-inicial',
  imports: [NavbarInicial, FormularioLogin],
  templateUrl: './pagina-inicial.html',
  styleUrl: './pagina-inicial.css',
})
export class PaginaInicial { }
