import { Component } from '@angular/core';
import { NavbarLogin } from '../../components/navbar-login/navbar-login';
import { FormularioLogin } from '../../components/formulario-login/formulario-login';

@Component({
  selector: 'app-pagina-login',
  imports: [NavbarLogin, FormularioLogin],
  templateUrl: './pagina-login.html',
  styleUrl: './pagina-login.css',
})
export class PaginaLogin { }
