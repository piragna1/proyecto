import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-componente-home',
  imports: [RouterLink],
  templateUrl: './componente-home.html',
  styleUrl: './componente-home.css',
})
export class ComponenteHome implements OnInit {
  usuario: string = 'Usuario';
  ngOnInit(): void {

    const usuarioData = localStorage.getItem('usuario');

    if (!usuarioData) return;
    const usuario = JSON.parse(usuarioData);

    this.usuario = usuario.nombre;
  }
}
