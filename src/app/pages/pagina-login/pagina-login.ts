import { Component } from '@angular/core';
import { NavbarLogin } from '../../components/navbar-login/navbar-login';
import { FormularioLogin } from '../../components/formulario-login/formulario-login';
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-pagina-login',
  imports: [NavbarLogin, FormularioLogin, Footer],
  templateUrl: './pagina-login.html',
  styleUrl: './pagina-login.css',
})
export class PaginaLogin { }
