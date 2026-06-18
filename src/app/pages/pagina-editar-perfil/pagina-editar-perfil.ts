import { Component } from '@angular/core';
import { EditarPerfil } from '../../components/editar-perfil/editar-perfil';
import { NavbarUsuarioHome } from '../../components/navbar-usuario-home/navbar-usuario-home';
@Component({
  selector: 'app-pagina-editar-perfil',
  imports: [EditarPerfil, NavbarUsuarioHome],
  templateUrl: './pagina-editar-perfil.html',
  styleUrl: './pagina-editar-perfil.css',
})
export class PaginaEditarPerfil { }
