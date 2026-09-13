import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { NotificacionService } from '../../notificacion/services/notificacion-service';

@Component({
  selector: 'app-componente-notificaciones-administrador',
  imports: [RouterLink, DatePipe],
  templateUrl: './componente-notificaciones-administrador.html',
  styleUrl: './componente-notificaciones-administrador.css',
})
export class ComponenteNotificacionesAdministrador implements OnInit {
  ns: NotificacionService = inject(NotificacionService);
  notificaciones = this.ns.getNotificacionesSignal();
  ngOnInit(): void {
    this.cargarNotificaciones();
  };
  cargarNotificaciones() {
    this.ns.getNotificaciones().subscribe({
      next: (lista: any[]) => {
        this.ns.limpiarNotificacionesSignal();
        lista.forEach((n) => {
          this.ns.setNotificacionesSignal({
            id: n.id,
            tipo: n.tipo,
            motivo: n.motivo,
            telefono: n.telefono,
            mensaje: n.mensaje,
            estado: n.estado,
            fecha_envio: n.fecha_envio,
            usuario_nombre: n.usuario_nombre
          });
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  };
}