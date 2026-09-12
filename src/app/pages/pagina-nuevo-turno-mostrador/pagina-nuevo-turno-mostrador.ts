import { Component, inject } from '@angular/core';
import { NavbarInicialAdmin } from '../../components/navbar-inicial-admin/navbar-inicial-admin';
import { NavbarInicialPeluquero } from '../../components/navbar-inicial-peluquero/navbar-inicial-peluquero';
import { ComponenteNuevoTurnoMostrador } from '../../components/componente-nuevo-turno-mostrador/componente-nuevo-turno-mostrador';
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-pagina-nuevo-turno-mostrador',
  imports: [NavbarInicialAdmin, NavbarInicialPeluquero, ComponenteNuevoTurnoMostrador],
  templateUrl: './pagina-nuevo-turno-mostrador.html',
  styleUrl: './pagina-nuevo-turno-mostrador.css',
})
export class PaginaNuevoTurnoMostrador {
  rol = inject(AuthService).obtenerRolUsuario();
}