import { Component } from '@angular/core';
import { NavbarRegistro } from '../../components/navbar-registro/navbar-registro';
import { FormularioRegistro } from '../../components/formulario-registro/formulario-registro';

@Component({
  selector: 'app-pagina-registro',
  imports: [NavbarRegistro, FormularioRegistro],
  templateUrl: './pagina-registro.html',
  styleUrl: './pagina-registro.css',
})
export class PaginaRegistro { }
