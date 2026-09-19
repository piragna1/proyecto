import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-registro',
  imports: [RouterLink],
  templateUrl: './navbar-registro.html',
  styleUrl: './navbar-registro.css',
})
export class NavbarRegistro {
  abierto = signal(false);
  alternar() {
    this.abierto.update((v) => !v);
  }
  cerrar() {
    this.abierto.set(false);
  }
}
