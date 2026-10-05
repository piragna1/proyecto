import { Component } from '@angular/core';
import { FormularioLogin } from '../../components/formulario-login/formulario-login';

@Component({
  selector: 'app-pagina-inicial',
  imports: [FormularioLogin],
  templateUrl: './pagina-inicial.html',
  styleUrl: './pagina-inicial.css',
})
export class PaginaInicial { }
