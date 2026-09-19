import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-inicial',
  imports: [RouterLink],
  templateUrl: './navbar-inicial.html',
  styleUrl: './navbar-inicial.css',
})
export class NavbarInicial {
  abierto = signal(false);
  alternar() {
    this.abierto.update((v) => !v);
  }
  cerrar() {
    this.abierto.set(false);
  }
}
