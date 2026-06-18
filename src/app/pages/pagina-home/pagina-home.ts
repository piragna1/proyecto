import { Component } from '@angular/core';
import { NavbarUsuarioHome } from '../../components/navbar-usuario-home/navbar-usuario-home';
import { ComponenteHome } from "../../components/componente-home/componente-home";

@Component({
  selector: 'app-pagina-home',
  imports: [NavbarUsuarioHome, ComponenteHome],
  templateUrl: './pagina-home.html',
  styleUrl: './pagina-home.css',
})
export class PaginaHome { }
