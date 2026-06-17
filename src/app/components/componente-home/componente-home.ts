import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-componente-home',
  imports: [RouterLink],
  templateUrl: './componente-home.html',
  styleUrl: './componente-home.css',
})
export class ComponenteHome implements OnInit {
  as:AuthService= inject(AuthService);
  usuario: string = 'Usuario';

  ngOnInit(): void {

    const payload = this.as.obtenerPayload();
    console.log(payload);
    

    if (!payload) return;

    this.usuario = payload.nombre;
  }
}
