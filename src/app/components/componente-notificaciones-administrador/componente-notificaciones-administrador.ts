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

  orden = signal<string>('');
  direccion = signal<'asc' | 'desc'>('desc');

  private debounceTimer: ReturnType<typeof setTimeout> | undefined;
  private refreshTimer: ReturnType<typeof setInterval> | undefined;
  private cargando = false;

  ngOnInit(): void {
    this.cargarNotificaciones();
  };

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  };

  cargarNotificaciones() {
    if (this.cargando) return;
    this.cargando = true;
    this.ns.getNotificaciones({
      fecha: this.filtros.fecha() || undefined,
      usuario: this.filtros.usuario().trim() || undefined,
      tipo: this.filtros.tipo() || undefined,
      motivo: this.filtros.motivo().trim() || undefined,
      telefono: this.filtros.telefono().trim() || undefined,
      mensaje: this.filtros.mensaje().trim() || undefined,
      estado: this.filtros.estado() || undefined,
      orden: this.orden() || undefined,
      direccion: this.orden() ? this.direccion() : undefined,
    }).subscribe({
      next: (lista: any[]) => {
        this.cargando = false;
        this.ns.limpiarNotificacionesSignal();
        let hayPendientes = false;
        lista.forEach((n) => {
          if (n.estado === 'pendiente') hayPendientes = true;
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
        if (hayPendientes) {
          if (!this.refreshTimer) {
            this.refreshTimer = setInterval(() => this.cargarNotificaciones(), 4000);
          }
        } else if (this.refreshTimer) {
          clearInterval(this.refreshTimer);
          this.refreshTimer = undefined;
        }
      },
      error: (err) => {
        this.cargando = false;
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

  accionOrdenar(campo: CampoFiltro) {
    if (this.orden() === campo) {
      this.direccion.set(this.direccion() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orden.set(campo);
      this.direccion.set('asc');
    }
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.cargarNotificaciones();
  };
}