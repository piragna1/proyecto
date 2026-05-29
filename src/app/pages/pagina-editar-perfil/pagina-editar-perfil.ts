import { Component } from '@angular/core';
import { EditarPerfil } from '../../components/editar-perfil/editar-perfil';
import { NavbarUsuarioHome } from '../../components/navbar-usuario-home/navbar-usuario-home';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-editar-perfil',
  imports: [EditarPerfil, NavbarUsuarioHome, Footer],
  templateUrl: './pagina-editar-perfil.html',
  styleUrl: './pagina-editar-perfil.css',
})
export class PaginaEditarPerfil { }
