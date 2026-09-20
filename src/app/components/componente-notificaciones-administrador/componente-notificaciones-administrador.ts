import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { NotificacionService } from '../../notificacion/services/notificacion-service';

type CampoFiltro = 'fecha' | 'usuario' | 'tipo' | 'motivo' | 'telefono' | 'mensaje' | 'estado';

@Component({
  selector: 'app-componente-notificaciones-administrador',
  imports: [RouterLink, DatePipe],
  templateUrl: './componente-notificaciones-administrador.html',
  styleUrl: './componente-notificaciones-administrador.css',
})
export class ComponenteNotificacionesAdministrador implements OnInit, OnDestroy {
  ns: NotificacionService = inject(NotificacionService);
  notificaciones = this.ns.getNotificacionesSignal();

  filtros: Record<CampoFiltro, WritableSignal<string>> = {
    fecha: signal(''),
    usuario: signal(''),
    tipo: signal(''),
    motivo: signal(''),
    telefono: signal(''),
    mensaje: signal(''),
    estado: signal(''),
  };

  private debounceTimer: ReturnType<typeof setTimeout> | undefined;

  ngOnInit(): void {
    this.cargarNotificaciones();
  };

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  };

  cargarNotificaciones() {
    this.ns.getNotificaciones({
      fecha: this.filtros.fecha() || undefined,
      usuario: this.filtros.usuario().trim() || undefined,
      tipo: this.filtros.tipo() || undefined,
      motivo: this.filtros.motivo().trim() || undefined,
      telefono: this.filtros.telefono().trim() || undefined,
      mensaje: this.filtros.mensaje().trim() || undefined,
      estado: this.filtros.estado() || undefined,
    }).subscribe({
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

  actualizarFiltro(campo: CampoFiltro, valor: string | Event) {
    const v = typeof valor === 'string' ? valor : (valor.target as HTMLInputElement)?.value ?? '';
    this.filtros[campo].set(v);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.cargarNotificaciones(), 400);
  };

  verTodos() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    (Object.keys(this.filtros) as CampoFiltro[]).forEach((campo) => this.filtros[campo].set(''));
    this.cargarNotificaciones();
  };
}