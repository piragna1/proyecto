import { Component } from '@angular/core';
import { FormularioRegistro } from '../../components/formulario-registro/formulario-registro';

@Component({
  selector: 'app-pagina-registro',
  imports: [FormularioRegistro],
  templateUrl: './pagina-registro.html',
  styleUrl: './pagina-registro.css',
})
export class PaginaRegistro { }
