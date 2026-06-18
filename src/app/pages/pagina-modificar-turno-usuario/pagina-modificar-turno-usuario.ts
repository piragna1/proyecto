import { Component } from '@angular/core';
import { NavbarUsuarioMisTurnos } from '../../components/navbar-usuario-mis-turnos/navbar-usuario-mis-turnos';
import { ComponenteModificarTurnoUsuario } from '../../components/componente-modificar-turno-usuario/componente-modificar-turno-usuario';

@Component({
  selector: 'app-pagina-modificar-turno-usuario',
  imports: [NavbarUsuarioMisTurnos, ComponenteModificarTurnoUsuario],
  templateUrl: './pagina-modificar-turno-usuario.html',
  styleUrl: './pagina-modificar-turno-usuario.css',
})
export class PaginaModificarTurnoUsuario { }
