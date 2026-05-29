import { Component } from '@angular/core';
import { NavbarUsuarioMisTurnos } from '../../components/navbar-usuario-mis-turnos/navbar-usuario-mis-turnos';
import { ComponenteModificarTurnoUsuario } from '../../components/componente-modificar-turno-usuario/componente-modificar-turno-usuario';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-pagina-modificar-turno-usuario',
  imports: [NavbarUsuarioMisTurnos, ComponenteModificarTurnoUsuario, Footer],
  templateUrl: './pagina-modificar-turno-usuario.html',
  styleUrl: './pagina-modificar-turno-usuario.css',
})
export class PaginaModificarTurnoUsuario { }
